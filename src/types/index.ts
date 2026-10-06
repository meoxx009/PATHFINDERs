export type TargetRoleId = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'devops' 
  | 'cloud' 
  | 'qa_automation'
  | 'cybersecurity'
  | 'data_analyst' 
  | 'data_engineer' 
  | 'ml_engineer' 
  | 'ai_engineer'
  | 'embedded_software'
  | 'vlsi_design'
  | 'pcb_design_eng'
  | 'mech_design'
  | 'robotics_engineer'
  | 'structural_engineer'
  | 'bim_engineer'
  | 'process_engineer'
  | 'bioinformatics_engineer'
  | string;

export type ExperienceLevel = 'beginner' | 'intern' | 'entry_level';

export type SprintDuration = 7 | 14;

export type EngineeringBranchId = string;

export interface UserCareerProfile {
  targetRole: TargetRoleId;
  targetRoleTitle: string;
  experienceLevel: ExperienceLevel;
  weeklyHours: number;
  durationDays: SprintDuration;
  resumeText: string;
  engineeringBranch?: EngineeringBranchId;
  branchTitle?: string;
  specialization?: string;
  selfAssessment?: Record<string, number>;

  // Personal details
  fullName?: string;
  email?: string;
  university?: string;
  graduationYear?: string;
  currentSemester?: string;

  // Engineering identity
  degree?: string;
  stream?: string;

  // Learning preferences
  learningStyle?: 'hands_on' | 'deep_dive' | 'video_guided' | 'hybrid';
  roadmapIntensity?: 'standard' | 'accelerated' | 'deep_dive';

  // Career focus
  preferredIndustry?: string;
  workMode?: 'remote' | 'hybrid' | 'onsite';
  locationPreference?: string;
  careerGoalType?: 'internship' | 'placement' | 'full_time';
}

export type EvidenceQuality = 'demonstrated' | 'partial' | 'missing';

export interface SkillEvidence {
  skill: string;
  category: 'core_technical' | 'tools_libraries' | 'architecture_concepts' | 'testing_deployment' | 'soft_skills';
  quality: EvidenceQuality;
  evidenceExcerpt?: string; // verbatim quote from resume
  explanation: string;
  importance: 'critical' | 'high' | 'medium';
}

export type EvidenceClassificationType =
  | 'academic_project'
  | 'personal_project'
  | 'internship'
  | 'lab_coursework'
  | 'competition'
  | 'certification'
  | 'publication'
  | 'claimed_only'
  | 'not_observed';

export interface CandidateSummary {
  engineeringBranch: string;
  specialization?: string;
  currentLevel: 'student' | 'intern' | 'entry_level' | 'early_career';
  mainTechnicalDirection: string;
  targetRoleAlignment: string;
  missingContext: string[];
}

export interface SkillEvidenceMapItem {
  skillName: string;
  evidenceType: EvidenceClassificationType;
  exactExcerpt?: string; // verbatim quote
  source: string; // e.g. "Project: E-Commerce Platform"
  evidenceStrength: 'strong' | 'moderate' | 'weak' | 'not_observed';
  confidence: 'High confidence' | 'Medium confidence' | 'Needs validation';
  recommendation: string;
}

export interface ProjectAnalysisItem {
  name: string;
  problemSolved: string;
  userOrIndustrialContext: string;
  technicalApproach: string;
  toolsUsed: string[];
  candidateContribution: string;
  measurableResult?: string;
  missingTechnicalDepth: string;
  suggestedInterviewQuestions: string[];
}

export interface RoleAlignmentItem {
  targetRoleId: string;
  targetRoleTitle: string;
  strongMatches: Array<{ skill: string; evidence: string }>;
  partialMatches: Array<{ skill: string; gap: string }>;
  missingRequirements: Array<{ skill: string; reason: string }>;
  nonRelevantItems: string[];
  resumeOrderingSuggestions: string[];
}

export interface ResumeImprovementItem {
  category: 'measurable_outcome' | 'personal_contribution' | 'technical_decisions' | 'testing_validation' | 'deployment_manufacturing' | 'tools_links' | 'section_ordering';
  title: string;
  suggestion: string;
  affectedSection?: string;
}

export interface ExtractedResume {
  rawText: string;
  candidateName?: string;
  summary?: string;
  education: Array<{
    institution: string;
    degree: string;
    year?: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    period?: string;
    highlights: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    evidenceSnippets: string[];
  }>;
  extractedSkills: string[];
  strengths: string[];
  weakEvidenceAreas: string[];
  missingCriticalInfo: string[];
  truthfulSuggestions: string[];

  // Professional Engineering Analyzer Output (Prompt 5)
  candidateSummary?: CandidateSummary;
  evidenceMap?: SkillEvidenceMapItem[];
  projectAnalyses?: ProjectAnalysisItem[];
  roleAlignment?: RoleAlignmentItem;
  resumeImprovements?: ResumeImprovementItem[];
  detectedLinks?: { github?: string[]; portfolio?: string[]; linkedin?: string[] };
  quantifiedMetrics?: string[];
  standardsAndCompliance?: string[];
  analysisVersion?: string;
}

export interface RoleTaxonomy {
  id: TargetRoleId;
  title: string;
  description: string;
  requiredSkills: {
    skill: string;
    category: SkillEvidence['category'];
    importance: 'critical' | 'high' | 'medium';
    benchmarkDescription: string;
  }[];
}

import type {
  SkillEvidenceState,
  ConfidenceTier,
  GapPriorityLabel,
  SkillJudgementResult,
} from '../services/competencyAlgorithm';

export type {
  SkillEvidenceState,
  ConfidenceTier,
  GapPriorityLabel,
  SkillJudgementResult,
};

export interface GapAnalysisResult {
  demonstrated: SkillEvidence[];
  partial: SkillEvidence[];
  missing: SkillEvidence[];
  highPriorityGaps: SkillEvidence[];
  overallReadinessScore: number; // 0 - 100 benchmark
  summary: string;
  judgements?: SkillJudgementResult[];
  disputedSkills?: string[];
  hiddenSkills?: string[];
  customSkills?: SkillJudgementResult[];
}

export interface LearningTask {
  id: string;
  title: string;
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  dayNumber: number; // 1 to 7 or 14
  reasonItMatters: string;
  learningAction: string;
  practiceTask: string;
  expectedOutcome: string;
  completed: boolean;
  adaptedFromInterview?: boolean;
  adaptationReason?: string;
}

export interface InterviewQuestion {
  id: string;
  targetRole: TargetRoleId;
  question: string;
  testedSkills: string[];
  contextRationale: string;
  rubric: {
    relevanceCriteria: string;
    evidenceCriteria: string;
    clarityCriteria: string;
  };
  sampleAnswers?: {
    weak: {
      text: string;
      label: string;
    };
    strong: {
      text: string;
      label: string;
    };
  };
}

export interface DimensionScore {
  score: number; // 1-5
  feedback: string;
}

export interface InterviewEvaluation {
  id: string;
  questionId: string;
  userAnswer: string;
  evaluatedAt: string;
  dimensions: {
    relevance: DimensionScore;
    structure: DimensionScore;
    specificity: DimensionScore;
    evidence: DimensionScore;
    technicalClarity: DimensionScore;
  };
  overallScore: number; // average
  strengths: string[];
  weaknesses: string[];
  keyMissingElements: string[];
  detectedSkillSignal: {
    skill: string;
    previousState: EvidenceQuality;
    newState: EvidenceQuality | 'needs_practice';
    explanation: string;
  };
  adaptiveAction: {
    affectedTaskId: string;
    taskTitle: string;
    previousDay: number;
    newDay: number;
    explanation: string;
  };
}

export interface AdaptiveEvent {
  timestamp: string;
  skillSignal: string;
  taskMovedTitle: string;
  fromPosition: string;
  toPosition: string;
  reason: string;
}

export interface ProductMetrics {
  analysisResponseTimeMs: number;
  extractedSkillCount: number;
  actionableGapsCount: number;
  generatedTasksCount: number;
  interviewSessionsCompleted: number;
  adaptiveUpdatesCount: number;
  completedTasksCount: number;
}
