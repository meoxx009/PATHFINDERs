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

// ==========================================
// MASTER PROMPT — ROLE EXPLORER DATA MODEL
// ==========================================

export type RoleSkillCategory =
  | 'foundations'
  | 'core_technical'
  | 'tools'
  | 'domain_skills'
  | 'testing_validation'
  | 'communication'
  | 'project_execution';

export interface RoleSkillRequirement {
  skillId: string;
  skillName: string;
  category: RoleSkillCategory | string;
  requiredLevel: 0 | 1 | 2 | 3 | 4 | 5;
  importance: 'critical' | 'high' | 'medium' | 'low';
  benchmarkDescription: string;
  evidenceExamples: string[];
  prerequisites: string[];
  suggestedPractice?: string;
}

export type EngineeringDomain =
  | 'software_it'
  | 'ai_data'
  | 'electronics_embedded'
  | 'mechanical_manufacturing'
  | 'civil_infra'
  | 'chemical_bio_materials'
  | 'interdisciplinary';

export interface CareerRole {
  id: string;
  title: string;
  slug: string;
  domain: EngineeringDomain;
  summary: string;
  description: string;
  engineeringFamilies: string[];
  streams: string[];
  specializations: string[];
  industries: string[];
  workModes: string[];
  interestTags: string[];
  experienceLevels: string[];
  beginnerFriendly: boolean;
  estimatedWeeks: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  requiredSkills: RoleSkillRequirement[];
  preferredSkills?: RoleSkillRequirement[];
  prerequisiteSkills: string[];
  commonProjects: string[];
  commonResponsibilities: string[];
  tools: string[];
  interviewTopics: string[];
  adjacentRoles?: string[];
  entryLevelExpectations?: string[];
  roadmapTemplateId?: string;
  assessmentProfileId?: string;
}

// ==========================================
// MASTER PROMPT — SCHEDULING & ROADMAP MODEL
// ==========================================

export type ScheduleBlockType =
  | 'learn'
  | 'practice'
  | 'project'
  | 'assessment'
  | 'interview'
  | 'review'
  | 'break';

export interface ScheduleBlock {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g., 'Monday'
  startTime: string; // '07:00'
  endTime: string; // '07:45'
  durationMinutes: number;
  type: ScheduleBlockType;
  taskId?: string;
  title: string;
  skillId?: string;
  completed: boolean;
  locked: boolean;
  notes?: string;
}

export interface RoadmapPreferences {
  currentSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  targetLevel: 'job_ready' | 'internship_ready' | 'advanced';
  currentBranch?: string;
  targetRoleId: string;
  goalType: 'internship' | 'placement' | 'full_time' | 'career_switch' | 'project_readiness';
  hoursPerWeek: number;
  durationWeeks: number;
  durationDays: number;
  daysPerWeek: number;
  selectedDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  maxDailyStudyMinutes: number;
  preferredSessionMinutes: number;
  breakDurationMinutes: number;
  startDate: string;
  timezone: string;
  learningStyle: 'hands_on' | 'reading' | 'video_guided' | 'problem_solving' | 'hybrid';
  intensity: 'balanced' | 'accelerated' | 'deep_practice';
  priorityMode: 'role_first' | 'skill_gap_first' | 'balanced';
  prioritySkills?: string[];
  skippedSkills?: string[];
}

export interface WeeklyMilestone {
  weekNumber: number;
  milestoneTitle: string;
  skillsCovered: string[];
  totalPlannedHours: number;
  plannedHoursByDay: Record<string, number>;
  projectDeliverable: string;
  assessmentOrReview: string;
  expectedEvidence: string;
  isOverloaded?: boolean;
}

// ==========================================
// MASTER PROMPT — TECHNICAL ASSESSMENT MODEL
// ==========================================

export type AssessmentQuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'short_answer'
  | 'scenario_analysis'
  | 'debugging'
  | 'design_decision'
  | 'practical_reasoning';

export interface TechnicalAssessmentQuestion {
  id: string;
  roleId: string;
  skillId: string;
  skillName: string;
  category: string;
  type: AssessmentQuestionType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenarioText?: string;
  codeSnippet?: string;
  question: string;
  options: string[];
  correctAnswers: number[]; // indices of correct options
  explanation: string;
  conceptTakeaway: string;
}

export interface TechnicalAssessmentResult {
  roleId: string;
  roleTitle: string;
  scorePercentage: number;
  totalQuestions: number;
  correctCount: number;
  estimatedLevel: number; // 0-5
  confidence: 'High confidence' | 'Medium confidence' | 'Needs validation';
  weakTopics: string[];
  strongTopics: string[];
  recommendedNextTask: string;
  answers: Array<{
    questionId: string;
    selectedOptions: number[];
    isCorrect: boolean;
  }>;
  completedAt: string;
}

// ==========================================
// MASTER PROMPT — BEHAVIORAL ASSESSMENT MODEL
// ==========================================

export interface BehavioralOption {
  id: string;
  text: string;
  competency: string; // e.g. 'ownership', 'communication', 'trade_off_reasoning'
  behaviorPattern: 'Strong evidence' | 'Consistent behavior' | 'Developing behavior' | 'Needs more examples';
  tradeoffExplanation: string;
}

export interface BehavioralScenario {
  id: string;
  title: string;
  engineeringContext: string;
  scenario: string;
  competencyEvaluated: string;
  options: BehavioralOption[];
}

export interface BehavioralResult {
  overallPattern: 'Strong evidence' | 'Consistent behavior' | 'Developing behavior' | 'Needs more examples';
  competencyBreakdown: Record<string, {
    pattern: string;
    explanation: string;
    developmentAction: string;
  }>;
  recommendedDevelopmentActions: string[];
  completedAt: string;
}

