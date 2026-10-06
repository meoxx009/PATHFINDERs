import { z } from 'zod';

// ====================================================================
// Section 8: AI Schemas as specified in Master Prompt
// ====================================================================

// 1. ResumeAnalysis Schema
export const ResumeAnalysisSchema = z.object({
  summary: z.string(),
  strengths: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      evidence: z.string(),
    })
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.enum(['demonstrated', 'partial', 'unknown']),
      evidence: z.string().nullable(),
      confidence: z.number().min(0).max(1),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      reason: z.string(),
      importance: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
      evidenceStatus: z.enum(['missing', 'weak', 'unclear']),
      recommendedAction: z.string(),
    })
  ),
  resumeImprovements: z.array(
    z.object({
      section: z.string(),
      issue: z.string(),
      suggestion: z.string(),
      evidence: z.string().nullable(),
    })
  ),
  warnings: z.array(z.string()),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

// 2. LearningPath Schema
export const LearningTaskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  skill: z.string(),
  reason: z.string(),
  description: z.string(),
  estimatedMinutes: z.number(),
  priority: z.enum(['high', 'medium', 'low']),
  expectedOutcome: z.string(),
  status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
  source: z.enum(['skill_gap', 'interview_feedback', 'user_goal']).default('skill_gap'),
});

export type LearningTaskItem = z.infer<typeof LearningTaskItemSchema>;

export const LearningPathSchema = z.object({
  title: z.string(),
  goal: z.string(),
  durationDays: z.number(),
  hoursPerWeek: z.number(),
  tasks: z.array(LearningTaskItemSchema),
  assumptions: z.array(z.string()),
});

export type LearningPath = z.infer<typeof LearningPathSchema>;

// 3. InterviewQuestion Schema
export const InterviewQuestionSchema = z.object({
  question: z.string(),
  questionType: z.enum(['behavioral', 'technical', 'project']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  testedSkills: z.array(z.string()),
  answerFramework: z.enum(['STAR', 'technical_explanation', 'project_walkthrough']),
  preparationHint: z.string(),
  sampleAnswers: z.object({
    weak: z.object({ label: z.string(), text: z.string() }),
    strong: z.object({ label: z.string(), text: z.string() }),
  }).optional(),
});

export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;

// 4. InterviewEvaluation Schema
export const InterviewEvaluationSchema = z.object({
  overallSummary: z.string(),
  overallScore: z.number().min(1).max(5).default(3.5),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  missingEvidence: z.array(z.string()),
  skillSignals: z.array(
    z.object({
      skill: z.string(),
      signal: z.enum(['strong', 'developing', 'weak', 'not_observed']),
      reason: z.string(),
    })
  ),
  nextPracticeTask: z.object({
    title: z.string(),
    skill: z.string(),
    reason: z.string(),
    estimatedMinutes: z.number(),
  }),
  adaptiveAction: z.object({
    triggerAdaptiveShift: z.boolean(),
    affectedTaskTitle: z.string(),
    previousDay: z.number(),
    newDay: z.number(),
    explanation: z.string(),
  }).optional(),
});

export type InterviewEvaluation = z.infer<typeof InterviewEvaluationSchema>;
