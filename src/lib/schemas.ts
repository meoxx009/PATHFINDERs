import { z } from 'zod';

// POST /api/analyze-resume
export const AnalyzeResumeRequestSchema = z.object({
  resumeText: z.string().min(20, 'Resume text must be at least 20 characters'),
  targetRole: z.string().default('frontend-developer'),
  experienceLevel: z.enum(['beginner', 'intern', 'entry_level']).default('beginner'),
});

export type AnalyzeResumeRequest = z.infer<typeof AnalyzeResumeRequestSchema>;

export const SkillEvidenceSchema = z.object({
  name: z.string(),
  status: z.enum(['demonstrated', 'partial', 'missing']),
  evidenceQuote: z.string().optional(),
  importance: z.number().min(1).max(5),
  category: z.string().default('core_technical'),
  note: z.string().default(''),
});

export type SkillEvidenceDTO = z.infer<typeof SkillEvidenceSchema>;

export const AnalyzeResumeResponseSchema = z.object({
  resumeId: z.string().optional(),
  analysisId: z.string().optional(),
  strengths: z.array(z.string()),
  skills: z.array(SkillEvidenceSchema).default([]),
  demonstratedSkills: z.array(SkillEvidenceSchema).optional(),
  allEvaluatedSkills: z.array(SkillEvidenceSchema).optional(),
  skillGaps: z.array(SkillEvidenceSchema).default([]),
  resumeImprovements: z.array(z.string()),
  evidenceWarnings: z.array(z.string()),
  overallReadinessScore: z.number().min(0).max(100),
  candidateName: z.string().default('Candidate'),
  rawAnalysis: z.any().optional(),
});

export type AnalyzeResumeResponse = z.infer<typeof AnalyzeResumeResponseSchema>;

// POST /api/generate-path
export const GeneratePathRequestSchema = z.object({
  analysis: z.any().optional(),
  targetRole: z.string().default('frontend-developer'),
  hoursPerWeek: z.number().min(1).max(40).default(6),
  goalDays: z.number().min(3).max(30).default(14),
});

export type GeneratePathRequest = z.infer<typeof GeneratePathRequestSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  skill: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  priorityScore: z.number().optional(),
  estimatedHours: z.number(),
  dayNumber: z.number(),
  reasonItMatters: z.string(),
  learningAction: z.string(),
  practiceTask: z.string(),
  expectedOutcome: z.string(),
  completed: z.boolean().default(false),
  adaptedFromInterview: z.boolean().default(false),
  adaptationReason: z.string().optional(),
});

export type TaskDTO = z.infer<typeof TaskSchema>;

export const GeneratePathResponseSchema = z.object({
  goal: z.string(),
  tasks: z.array(TaskSchema),
  weeklyCapacity: z.number(),
  allocatedHours: z.number(),
  assumptions: z.array(z.string()),
});

export type GeneratePathResponse = z.infer<typeof GeneratePathResponseSchema>;

// POST /api/interview/question
export const InterviewQuestionRequestSchema = z.object({
  targetRole: z.string().default('frontend-developer'),
  resumeAnalysis: z.any().optional(),
  questionNumber: z.number().default(1),
});

export type InterviewQuestionRequest = z.infer<typeof InterviewQuestionRequestSchema>;

export const InterviewQuestionResponseSchema = z.object({
  questionId: z.string(),
  sessionId: z.string().optional(),
  question: z.string(),
  testsSkills: z.array(z.string()),
  answerFramework: z.literal('STAR'),
  contextRationale: z.string(),
  sampleAnswers: z.object({
    weak: z.object({ label: z.string(), text: z.string() }),
    strong: z.object({ label: z.string(), text: z.string() }),
  }).optional(),
});

export type InterviewQuestionResponse = z.infer<typeof InterviewQuestionResponseSchema>;

// POST /api/interview/evaluate
export const InterviewEvaluateRequestSchema = z.object({
  sessionId: z.string().optional(),
  questionId: z.string().optional(),
  question: z.string(),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  targetRole: z.string().default('frontend-developer'),
  testsSkills: z.array(z.string()).default([]),
});

export type InterviewEvaluateRequest = z.infer<typeof InterviewEvaluateRequestSchema>;

export const DimensionScoreSchema = z.object({
  score: z.number().min(1).max(5),
  feedback: z.string(),
});

export const InterviewEvaluateResponseSchema = z.object({
  overallScore: z.number().min(1).max(5),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  missingEvidence: z.array(z.string()),
  skillSignals: z.array(z.object({
    skill: z.string(),
    signal: z.enum(['validated', 'degraded', 'needs_practice']),
    explanation: z.string(),
  })),
  nextPracticeTask: z.string(),
  dimensions: z.object({
    relevance: DimensionScoreSchema,
    structure: DimensionScoreSchema,
    specificity: DimensionScoreSchema,
    evidence: DimensionScoreSchema,
    technicalClarity: DimensionScoreSchema,
  }),
  adaptiveAction: z.object({
    triggerAdaptiveShift: z.boolean(),
    affectedTaskTitle: z.string(),
    previousDay: z.number(),
    newDay: z.number(),
    explanation: z.string(),
  }),
});

export type InterviewEvaluateResponse = z.infer<typeof InterviewEvaluateResponseSchema>;
