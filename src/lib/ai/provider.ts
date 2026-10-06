import type {
  ResumeAnalysis,
  LearningPath,
  InterviewQuestion,
  InterviewEvaluation,
} from './schemas';

export interface ResumeAnalysisInput {
  resumeText: string;
  targetRole: string;
  experienceLevel: string;
}

export interface LearningPathInput {
  analysis?: ResumeAnalysis;
  targetRole: string;
  hoursPerWeek: number;
  durationDays: number;
}

export interface InterviewQuestionInput {
  targetRole: string;
  resumeAnalysis?: ResumeAnalysis;
  questionNumber?: number;
}

export interface InterviewEvaluationInput {
  question: string;
  answer: string;
  targetRole: string;
  testedSkills: string[];
}

export interface AIProvider {
  analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysis>;
  generateLearningPath(input: LearningPathInput): Promise<LearningPath>;
  generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestion>;
  evaluateInterviewAnswer(input: InterviewEvaluationInput): Promise<InterviewEvaluation>;
}
