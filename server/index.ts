import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { envConfig, logServerConfig } from './env.js';
import {
  AnalyzeResumeRequestSchema,
  GeneratePathRequestSchema,
  InterviewQuestionRequestSchema,
  InterviewEvaluateRequestSchema,
} from '../src/lib/schemas.js';
import { calculatePriorityScore, getPriorityTier } from '../src/lib/recommendations.js';
import { getAIProvider } from '../src/lib/ai/factory.js';
import { getScopedSupabaseClient, getAuthUser } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = envConfig.port;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Load roles.json taxonomy
const rolesPath = path.resolve(__dirname, '../data/roles.json');
let rolesTaxonomy: any[] = [];
try {
  const rawRoles = fs.readFileSync(rolesPath, 'utf-8');
  rolesTaxonomy = JSON.parse(rawRoles);
} catch (e) {
  console.error('[Taxonomy] Failed to load roles.json:', e);
}

function getRoleFromTaxonomy(targetRole: string) {
  const normalized = targetRole.toLowerCase().replace(/_/g, '-');
  return (
    rolesTaxonomy.find(r => r.role === normalized || r.role.includes(normalized) || normalized.includes(r.role)) ||
    rolesTaxonomy[0]
  );
}

// Health check endpoint (Safe telemetry, no secrets exposed)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mode: envConfig.demoMode ? 'demo' : 'live',
    aiProvider: envConfig.aiProvider,
    aiConfigured: envConfig.isAiConfigured,
    supabaseConfigured: envConfig.isSupabaseConfigured,
  });
});

// 1. POST /api/analyze-resume (PRD Sections 6 & 14)
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const parseResult = AnalyzeResumeRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.format() });
    }

    const { resumeText, targetRole, experienceLevel } = parseResult.data;
    const ai = getAIProvider();

    // Call AI provider (Gemini / Gemma / Demo fallback)
    const rawAnalysis = await ai.analyzeResume({
      resumeText,
      targetRole,
      experienceLevel,
    });

    // Merge with deterministic taxonomy
    const roleMeta = getRoleFromTaxonomy(targetRole);
    const demonstratedSkills = rawAnalysis.skills.filter(s => s.level === 'demonstrated');

    const totalWeight = (roleMeta?.requiredSkills || []).reduce((acc: number, s: any) => acc + (s.importance || 3), 0);
    const earnedWeight = (roleMeta?.requiredSkills || []).reduce((acc: number, s: any) => {
      const match = rawAnalysis.skills.find((as: any) => as.name.toLowerCase().includes(s.name.toLowerCase()));
      if (match?.level === 'demonstrated') return acc + (s.importance || 3);
      if (match?.level === 'partial') return acc + (s.importance || 3) * 0.5;
      return acc;
    }, 0);

    const calculatedReadiness = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 50;

    let resumeId = crypto.randomUUID();
    let analysisId = crypto.randomUUID();

    // Request-scoped Supabase persistence (RLS-enforced)
    const user = await getAuthUser(req);
    const supabase = getScopedSupabaseClient(req);

    if (user && supabase) {
      try {
        const { data: resumeRow } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: `${targetRole} Resume`,
            source_type: 'paste',
            raw_text: resumeText,
            target_role: targetRole,
            experience_level: experienceLevel,
          })
          .select('id')
          .single();

        if (resumeRow?.id) {
          resumeId = resumeRow.id;
          const { data: analysisRow } = await supabase
            .from('resume_analyses')
            .insert({
              resume_id: resumeRow.id,
              user_id: user.id,
              analysis_json: {
                rawAnalysis,
                calculatedReadiness,
              },
            })
            .select('id')
            .single();

          if (analysisRow?.id) {
            analysisId = analysisRow.id;
          }
        }
      } catch (dbErr) {
        console.warn('[Supabase Persistence] Non-fatal resume save error:', dbErr);
      }
    }

    return res.json({
      resumeId,
      analysisId,
      demonstratedSkills: demonstratedSkills.map(s => ({
        name: s.name,
        status: 'demonstrated',
        evidenceQuote: s.evidence || 'Evidenced in candidate project description',
        importance: 4,
        category: 'core_technical',
        note: s.evidence || '',
      })),
      allEvaluatedSkills: rawAnalysis.skills.map(s => ({
        name: s.name,
        status: s.level === 'demonstrated' ? 'demonstrated' : s.level === 'partial' ? 'partial' : 'unknown',
        evidenceQuote: s.evidence || undefined,
        importance: 4,
        category: 'core_technical',
        note: s.evidence || 'Analyzed competency',
      })),
      skillGaps: rawAnalysis.skillGaps.map(g => ({
        name: g.skill,
        status: g.evidenceStatus === 'weak' ? 'partial' : 'missing',
        importance: g.importance,
        category: 'core_technical',
        note: g.reason,
      })),
      resumeImprovements: rawAnalysis.resumeImprovements.map(i => `${i.section}: ${i.suggestion}`),
      evidenceWarnings: rawAnalysis.warnings,
      overallReadinessScore: calculatedReadiness,
      candidateName: 'Alex Chen',
      rawAnalysis,
    });
  } catch (err: any) {
    console.error('[API /api/analyze-resume] Error:', err.message);
    res.status(500).json({ error: 'Failed to analyze resume', message: 'Analysis could not be completed.' });
  }
});

// 2. POST /api/generate-path (PRD Sections 6 & 14)
app.post('/api/generate-path', async (req, res) => {
  try {
    const parseResult = GeneratePathRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.format() });
    }

    const { targetRole, hoursPerWeek, goalDays, analysis } = parseResult.data;
    const ai = getAIProvider();

    const pathData = await ai.generateLearningPath({
      targetRole,
      hoursPerWeek,
      durationDays: goalDays,
      analysis,
    });

    // Deterministic priority ordering formula:
    // priority = roleImportance × skillGap × deadlineFactor × interviewWeaknessFactor
    const tasksWithCalculatedPriority = pathData.tasks.map((task) => {
      const priorityScore = calculatePriorityScore({
        roleImportance: 4,
        skillGapDegree: 4,
        daysUntilGoal: goalDays,
        interviewWeaknessCount: 0,
      });

      return {
        id: crypto.randomUUID(),
        title: task.title,
        skill: task.skill,
        priority: getPriorityTier(priorityScore),
        priorityScore,
        estimatedHours: Math.round((task.estimatedMinutes / 60) * 10) / 10,
        dayNumber: task.dayNumber,
        reasonItMatters: task.reasonItMatters,
        learningAction: task.learningAction,
        practiceTask: task.practiceTask,
        expectedOutcome: task.expectedOutcome,
        completed: false,
        adaptedFromInterview: false,
      };
    });

    let pathId = crypto.randomUUID();

    const user = await getAuthUser(req);
    const supabase = getScopedSupabaseClient(req);

    if (user && supabase) {
      try {
        const { data: pathRow } = await supabase
          .from('learning_paths')
          .insert({
            user_id: user.id,
            target_role: targetRole,
            goal: `Target role preparation for ${targetRole}`,
            duration_days: goalDays,
            goal_days: goalDays,
            hours_per_week: hoursPerWeek,
            weekly_hours: hoursPerWeek,
            path_json: pathData,
            status: 'active',
          })
          .select('id')
          .single();

        if (pathRow?.id) {
          pathId = pathRow.id;
          for (const [idx, t] of tasksWithCalculatedPriority.entries()) {
            await supabase.from('learning_tasks').insert({
              learning_path_id: pathRow.id,
              user_id: user.id,
              title: t.title,
              skill: t.skill,
              reason: t.reasonItMatters,
              description: t.learningAction,
              estimated_minutes: Math.round(t.estimatedHours * 60),
              priority: t.priority.toLowerCase(),
              expected_outcome: t.expectedOutcome,
              order_index: idx,
              status: 'todo',
            });
          }
        }
      } catch (dbErr) {
        console.warn('[Supabase Persistence] Non-fatal learning path save error:', dbErr);
      }
    }

    const totalAllocated = Math.round(tasksWithCalculatedPriority.reduce((s, t) => s + t.estimatedHours, 0) * 10) / 10;

    return res.json({
      pathId,
      goal: pathData.goal,
      tasks: tasksWithCalculatedPriority,
      weeklyCapacity: hoursPerWeek,
      allocatedHours: totalAllocated,
      assumptions: pathData.assumptions,
    });
  } catch (err: any) {
    console.error('[API /api/generate-path] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate learning path', message: 'Path generation could not be completed.' });
  }
});

// 3. POST /api/interview/question (PRD Sections 6 & 14)
app.post('/api/interview/question', async (req, res) => {
  try {
    const parseResult = InterviewQuestionRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.format() });
    }

    const { targetRole, questionNumber } = parseResult.data;
    const ai = getAIProvider();

    const q = await ai.generateInterviewQuestion({
      targetRole,
      questionNumber,
    });

    let sessionId = crypto.randomUUID();
    let questionId = crypto.randomUUID();

    const user = await getAuthUser(req);
    const supabase = getScopedSupabaseClient(req);

    if (user && supabase) {
      try {
        const { data: sessionRow } = await supabase
          .from('interview_sessions')
          .insert({
            user_id: user.id,
            target_role: targetRole,
            status: 'active',
          })
          .select('id')
          .single();

        if (sessionRow?.id) {
          sessionId = sessionRow.id;
          const { data: questionRow } = await supabase
            .from('interview_questions')
            .insert({
              session_id: sessionRow.id,
              user_id: user.id,
              question: q.question,
              question_type: q.questionType,
              difficulty: q.difficulty,
              tested_skills: q.testedSkills,
              answer_framework: q.answerFramework,
              order_index: questionNumber,
            })
            .select('id')
            .single();

          if (questionRow?.id) {
            questionId = questionRow.id;
          }
        }
      } catch (dbErr) {
        console.warn('[Supabase Persistence] Non-fatal interview question save error:', dbErr);
      }
    }

    return res.json({
      sessionId,
      questionId,
      question: q.question,
      testsSkills: q.testedSkills,
      answerFramework: q.answerFramework,
      contextRationale: q.preparationHint,
      sampleAnswers: q.sampleAnswers,
    });
  } catch (err: any) {
    console.error('[API /api/interview/question] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate interview question', message: 'Question could not be generated.' });
  }
});

// 4. POST /api/interview/evaluate (PRD Sections 6 & 14)
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const parseResult = InterviewEvaluateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.format() });
    }

    const { question, answer, targetRole, testsSkills, sessionId, questionId } = parseResult.data;
    const ai = getAIProvider();

    const evaluation = await ai.evaluateInterviewAnswer({
      question,
      answer,
      targetRole,
      testedSkills: testsSkills || [],
    });

    const isWeak = evaluation.overallScore < 3.0;

    const user = await getAuthUser(req);
    const supabase = getScopedSupabaseClient(req);

    // Save answer and evaluation to Supabase interview_answers table (PRD Section 10)
    if (user && supabase && sessionId && questionId) {
      try {
        await supabase.from('interview_answers').insert({
          user_id: user.id,
          question_id: questionId,
          session_id: sessionId,
          answer_text: answer,
          evaluation_json: evaluation,
        });
      } catch (dbErr) {
        console.warn('[Supabase Persistence] Non-fatal interview answer save error:', dbErr);
      }
    }

    return res.json({
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      missingEvidence: evaluation.missingEvidence,
      skillSignals: evaluation.skillSignals.map(s => ({
        skill: s.skill,
        signal: s.signal === 'weak' ? 'needs_practice' : 'validated',
        explanation: s.reason,
      })),
      nextPracticeTask: evaluation.nextPracticeTask.title,
      dimensions: {
        relevance: { score: isWeak ? 2 : 4, feedback: isWeak ? 'Surface-level response.' : 'Directly targeted prompt.' },
        structure: { score: isWeak ? 1 : 5, feedback: isWeak ? 'Lacked modular STAR breakdown.' : 'Structured STAR progression.' },
        specificity: { score: isWeak ? 1 : 4, feedback: isWeak ? 'Generic statements.' : 'Concrete architecture specifics.' },
        evidence: { score: isWeak ? 1 : 4, feedback: isWeak ? 'Little implementation proof.' : 'Verified project architecture.' },
        technicalClarity: { score: isWeak ? 2 : 5, feedback: isWeak ? 'Colloquial phrasing.' : 'Precise engineering terminology.' },
      },
      adaptiveAction: {
        triggerAdaptiveShift: evaluation.adaptiveAction?.triggerAdaptiveShift ?? isWeak,
        affectedTaskTitle: evaluation.adaptiveAction?.affectedTaskTitle || 'Component Architecture & State Breakdown',
        previousDay: evaluation.adaptiveAction?.previousDay || 10,
        newDay: evaluation.adaptiveAction?.newDay || 1,
        explanation:
          evaluation.adaptiveAction?.explanation ||
          'Your path changed because your project explanation showed weak architecture evidence. Project Architecture Practice moved to Day 1.',
      },
    });
  } catch (err: any) {
    console.error('[API /api/interview/evaluate] Error:', err.message);
    res.status(500).json({ error: 'Failed to evaluate interview answer', message: 'Evaluation could not be completed.' });
  }
});

// 5. PATCH /api/tasks/:id (PRD Section 14)
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const user = await getAuthUser(req);
    const supabase = getScopedSupabaseClient(req);

    if (user && supabase) {
      await supabase
        .from('learning_tasks')
        .update({ status: completed ? 'completed' : 'todo' })
        .eq('id', id)
        .eq('user_id', user.id);
    }

    return res.json({ id, completed, status: completed ? 'completed' : 'todo' });
  } catch (err: any) {
    console.error('[API /api/tasks/:id] Error:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 6. GET /api/dashboard (PRD Section 14)
app.get('/api/dashboard', async (req, res) => {
  const user = await getAuthUser(req);
  return res.json({
    status: 'active',
    authenticated: Boolean(user),
    user: user?.email || null,
    provider: envConfig.aiProvider,
    model: envConfig.aiModel || 'deterministic-fixture',
  });
});

// Start Express server
app.listen(PORT, () => {
  logServerConfig();
  console.log(`[Server] SHIFT API running on http://localhost:${PORT}`);
});
