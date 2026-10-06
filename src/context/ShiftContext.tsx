import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  AdaptiveEvent,
  CareerRole,
  ExtractedResume,
  GapAnalysisResult,
  InterviewEvaluation,
  InterviewQuestion,
  LearningTask,
  ProductMetrics,
  RoadmapPreferences,
  ScheduleBlock,
  WeeklyMilestone,
  TechnicalAssessmentResult,
  BehavioralResult,
  UserCareerProfile,
} from '../types';
import { getRoleById } from '../data/roles';
import { generateDeterministicSchedule, DEFAULT_ROADMAP_PREFERENCES } from '../services/scheduler';
import { DEMO_PRESETS } from '../data/demoProfiles';
import { analyzeResume as localAnalyzeResume } from '../services/analyzer';
import { generateLearningPath as localGenerateLearningPath } from '../services/pathGenerator';
import { getInterviewQuestionsForProfile, evaluateInterviewAnswer as localEvaluateInterviewAnswer } from '../services/interviewCoach';
import {
  fetchHealth,
  fetchAnalyzeResume,
  fetchGeneratePath,
  fetchInterviewQuestion,
  fetchInterviewEvaluate,
  patchTaskStatus,
} from '../services/apiClient';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { evaluateSkill } from '../services/competencyAlgorithm';
import type { SkillJudgementResult } from '../services/competencyAlgorithm';

export type AppStep =
  | 'landing'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'roles'
  | 'role-detail'
  | 'setup'
  | 'assessment'
  | 'technical-assessment'
  | 'behavioral-assessment'
  | 'analysis'
  | 'gap'
  | 'path'
  | 'schedule-customizer'
  | 'interview'
  | 'feedback'
  | 'settings'
  | 'user-profile';

export type BackendMode = 'live' | 'demo' | 'offline';

interface ShiftContextType {
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  profile: UserCareerProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserCareerProfile>>;
  extractedResume: ExtractedResume | null;
  gapAnalysis: GapAnalysisResult | null;
  learningTasks: LearningTask[];
  interviewQuestions: InterviewQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  latestEvaluation: InterviewEvaluation | null;
  evaluationsHistory: InterviewEvaluation[];
  latestAdaptiveEvent: AdaptiveEvent | null;
  metrics: ProductMetrics;
  isAnalyzing: boolean;
  isEvaluating: boolean;
  activeBackendMode: BackendMode;
  aiProviderName: string;
  currentInterviewSessionId: string | null;
  currentInterviewQuestionId: string | null;
  
  // Auth state & modals
  user: User | null;
  isAuthLoading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup';
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  firstVisitModalOpen: boolean;
  setFirstVisitModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  dismissFirstVisitModal: () => void;
  loadUserProfileFromSupabase: (userId: string) => Promise<void>;
  saveUserProfile: (updatedProfile: UserCareerProfile) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;

  loadDemoScenario: (presetId?: string) => void;
  runAnalysis: (overrideProfile?: UserCareerProfile) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => void;
  submitInterviewAnswer: (answer: string) => Promise<void>;
  resetWorkspace: () => void;
  clearAdaptiveBanner: () => void;

  // Multi-signal competency controls
  disputedSkills: string[];
  hiddenSkills: string[];
  customSkills: SkillJudgementResult[];
  updateSkillSelfRating: (skillName: string, level: number) => void;
  disputeSkillEvidence: (skillName: string) => void;
  addCustomSkill: (skillName: string, category: string, requiredLevel: number, selfLevel: number, projectExcerpt?: string) => void;
  hideSkill: (skillName: string) => void;
  unhideSkill: (skillName: string) => void;
  recalculatePath: () => void;
  changeTargetRole: (roleId: string, roleTitle: string) => void;

  // Role exploration & bookmarking
  selectedRole: CareerRole | null;
  setSelectedRole: (role: CareerRole | null) => void;
  bookmarkedRoleIds: string[];
  toggleBookmarkRole: (roleId: string) => void;

  // Custom scheduling & capacity engine
  roadmapPreferences: RoadmapPreferences;
  setRoadmapPreferences: React.Dispatch<React.SetStateAction<RoadmapPreferences>>;
  scheduleBlocks: ScheduleBlock[];
  weeklyMilestones: WeeklyMilestone[];
  recalculateSchedule: (prefs?: RoadmapPreferences) => void;

  // Technical & Behavioral Assessments
  technicalAssessmentResult: TechnicalAssessmentResult | null;
  setTechnicalAssessmentResult: (result: TechnicalAssessmentResult | null) => void;
  behavioralAssessmentResult: BehavioralResult | null;
  setBehavioralAssessmentResult: (result: BehavioralResult | null) => void;
}

const STORAGE_KEY = 'shift_workspace_state_v1';

const defaultProfile: UserCareerProfile = {
  targetRole: 'frontend',
  targetRoleTitle: 'Frontend Developer',
  experienceLevel: 'beginner',
  weeklyHours: 6,
  durationDays: 14,
  resumeText: DEMO_PRESETS[0].profile.resumeText,
};

const initialMetrics: ProductMetrics = {
  analysisResponseTimeMs: 0,
  extractedSkillCount: 0,
  actionableGapsCount: 0,
  generatedTasksCount: 0,
  interviewSessionsCompleted: 0,
  adaptiveUpdatesCount: 0,
  completedTasksCount: 0,
};

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [profile, setProfile] = useState<UserCareerProfile>(defaultProfile);
  const [extractedResume, setExtractedResume] = useState<ExtractedResume | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysisResult | null>(null);
  const [learningTasks, setLearningTasks] = useState<LearningTask[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [latestEvaluation, setLatestEvaluation] = useState<InterviewEvaluation | null>(null);
  const [evaluationsHistory, setEvaluationsHistory] = useState<InterviewEvaluation[]>([]);
  const [latestAdaptiveEvent, setLatestAdaptiveEvent] = useState<AdaptiveEvent | null>(null);
  const [metrics, setMetrics] = useState<ProductMetrics>(initialMetrics);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Backend telemetry status
  const [activeBackendMode, setActiveBackendMode] = useState<BackendMode>('demo');
  const [aiProviderName, setAiProviderName] = useState<string>('demo');
  const [currentInterviewSessionId, setCurrentInterviewSessionId] = useState<string | null>(null);
  const [currentInterviewQuestionId, setCurrentInterviewQuestionId] = useState<string | null>(null);

  // Auth state & modals
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [firstVisitModalOpen, setFirstVisitModalOpen] = useState<boolean>(false);

  // Multi-signal competency overrides
  const [disputedSkills, setDisputedSkills] = useState<string[]>([]);
  const [hiddenSkills, setHiddenSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<SkillJudgementResult[]>([]);

  // Role exploration & bookmarking
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(() => getRoleById(defaultProfile.targetRole));
  const [bookmarkedRoleIds, setBookmarkedRoleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('skillforge_bookmarked_roles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Scheduling & Assessments
  const [roadmapPreferences, setRoadmapPreferences] = useState<RoadmapPreferences>(DEFAULT_ROADMAP_PREFERENCES);
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [weeklyMilestones, setWeeklyMilestones] = useState<WeeklyMilestone[]>([]);
  const [technicalAssessmentResult, setTechnicalAssessmentResult] = useState<TechnicalAssessmentResult | null>(null);
  const [behavioralAssessmentResult, setBehavioralAssessmentResult] = useState<BehavioralResult | null>(null);

  const toggleBookmarkRole = (roleId: string) => {
    setBookmarkedRoleIds(prev => {
      const next = prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId];
      try {
        localStorage.setItem('skillforge_bookmarked_roles', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const recalculateSchedule = (overridePrefs?: RoadmapPreferences) => {
    const currentPrefs = overridePrefs || roadmapPreferences;
    if (learningTasks.length > 0) {
      const { blocks, milestones } = generateDeterministicSchedule(learningTasks, currentPrefs);
      setScheduleBlocks(blocks);
      setWeeklyMilestones(milestones);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const dismissFirstVisitModal = () => {
    try {
      localStorage.setItem('skillforge_auth_prompt_seen', 'true');
    } catch (e) {
      console.warn(e);
    }
    setFirstVisitModalOpen(false);
  };

  const loadUserProfileFromSupabase = async (userId: string) => {
    if (!supabase || !isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[Supabase] Error fetching profile:', error.message);
        return;
      }

      if (data) {
        setProfile((prev) => ({
          ...prev,
          fullName: data.full_name || data.display_name || prev.fullName,
          email: data.email || prev.email,
          targetRole: (data.target_role as any) || prev.targetRole,
          targetRoleTitle:
            data.target_role === 'frontend'
              ? 'Frontend Developer'
              : data.target_role === 'backend'
              ? 'Backend Developer'
              : data.target_role === 'data_analyst'
              ? 'Data Analyst'
              : prev.targetRoleTitle,
          experienceLevel: (data.experience_level as any) || prev.experienceLevel,
          weeklyHours: data.hours_per_week || prev.weeklyHours,
          durationDays: (data.goal_days as any) || prev.durationDays,
          university: data.university || prev.university,
          graduationYear: data.graduation_year || prev.graduationYear,
          currentSemester: data.current_semester || prev.currentSemester,
          degree: data.degree || prev.degree,
          engineeringBranch: data.engineering_branch || prev.engineeringBranch,
          stream: data.stream || prev.stream,
          specialization: data.specialization || prev.specialization,
          learningStyle: data.learning_style || prev.learningStyle,
          roadmapIntensity: data.roadmap_intensity || prev.roadmapIntensity,
          preferredIndustry: data.preferred_industry || prev.preferredIndustry,
          workMode: data.work_mode || prev.workMode,
          locationPreference: data.location_preference || prev.locationPreference,
          careerGoalType: data.career_goal_type || prev.careerGoalType,
          ...(data.extended_profile || {}),
        }));
      }
    } catch (e) {
      console.warn('[Supabase] Profile loading exception:', e);
    }
  };

  const saveUserProfile = async (
    updatedProfile: UserCareerProfile
  ): Promise<{ success: boolean; message: string }> => {
    setProfile(updatedProfile);

    if (!user || !supabase || !isSupabaseConfigured) {
      return {
        success: true,
        message: 'Saved to local workspace. Create an account to keep this progress across devices.',
      };
    }

    try {
      const payload: any = {
        id: user.id,
        display_name: updatedProfile.fullName || user.email?.split('@')[0] || 'Engineer',
        target_role: updatedProfile.targetRole,
        experience_level: updatedProfile.experienceLevel,
        hours_per_week: updatedProfile.weeklyHours,
        goal_days: updatedProfile.durationDays,
        updated_at: new Date().toISOString(),
      };

      if (updatedProfile.fullName) payload.full_name = updatedProfile.fullName;
      if (updatedProfile.email || user.email) payload.email = updatedProfile.email || user.email;
      if (updatedProfile.university) payload.university = updatedProfile.university;
      if (updatedProfile.graduationYear) payload.graduation_year = updatedProfile.graduationYear;
      if (updatedProfile.currentSemester) payload.current_semester = updatedProfile.currentSemester;
      if (updatedProfile.degree) payload.degree = updatedProfile.degree;
      if (updatedProfile.engineeringBranch) payload.engineering_branch = updatedProfile.engineeringBranch;
      if (updatedProfile.stream) payload.stream = updatedProfile.stream;
      if (updatedProfile.specialization) payload.specialization = updatedProfile.specialization;
      if (updatedProfile.learningStyle) payload.learning_style = updatedProfile.learningStyle;
      if (updatedProfile.roadmapIntensity) payload.roadmap_intensity = updatedProfile.roadmapIntensity;
      if (updatedProfile.preferredIndustry) payload.preferred_industry = updatedProfile.preferredIndustry;
      if (updatedProfile.workMode) payload.work_mode = updatedProfile.workMode;
      if (updatedProfile.locationPreference) payload.location_preference = updatedProfile.locationPreference;
      if (updatedProfile.careerGoalType) payload.career_goal_type = updatedProfile.careerGoalType;
      payload.extended_profile = {
        selfAssessment: updatedProfile.selfAssessment,
        branchTitle: updatedProfile.branchTitle,
      };

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

      if (error) {
        const fallback = {
          id: user.id,
          display_name: updatedProfile.fullName || 'Engineer',
          target_role: updatedProfile.targetRole,
          experience_level: updatedProfile.experienceLevel,
          hours_per_week: updatedProfile.weeklyHours,
          goal_days: updatedProfile.durationDays,
          updated_at: new Date().toISOString(),
        };
        const { error: fbErr } = await supabase.from('profiles').upsert(fallback, { onConflict: 'id' });
        if (fbErr) {
          return {
            success: false,
            message: 'Unable to save profile to database: ' + fbErr.message,
          };
        }
      }

      return {
        success: true,
        message: 'Profile successfully updated in cloud workspace.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Error communicating with database.',
      };
    }
  };

  const signOut = async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error', err);
      }
    }
    setUser(null);
  };

  // Check first visit modal after interactive mount
  useEffect(() => {
    try {
      const seen = localStorage.getItem('skillforge_auth_prompt_seen');
      if (!seen) {
        const timer = setTimeout(() => {
          setFirstVisitModalOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Supabase Auth listener & session restoration
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadUserProfileFromSupabase(session.user.id);
      }
      setIsAuthLoading(false);
    }).catch(() => {
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfileFromSupabase(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Probe backend health status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkBackend() {
      const health = await fetchHealth();
      if (!isMounted) return;
      if (health) {
        setActiveBackendMode(health.mode === 'live' ? 'live' : 'demo');
        setAiProviderName(health.aiProvider);
      } else {
        setActiveBackendMode('offline');
        setAiProviderName('deterministic-local');
      }
    }
    checkBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.extractedResume) setExtractedResume(parsed.extractedResume);
        if (parsed.gapAnalysis) setGapAnalysis(parsed.gapAnalysis);
        if (parsed.learningTasks) setLearningTasks(parsed.learningTasks);
        if (parsed.interviewQuestions) setInterviewQuestions(parsed.interviewQuestions);
        if (parsed.latestEvaluation) setLatestEvaluation(parsed.latestEvaluation);
        if (parsed.metrics) setMetrics(parsed.metrics);
        if (parsed.currentStep && parsed.currentStep !== 'landing') setCurrentStep(parsed.currentStep);
        if (parsed.currentInterviewSessionId) setCurrentInterviewSessionId(parsed.currentInterviewSessionId);
        if (parsed.currentInterviewQuestionId) setCurrentInterviewQuestionId(parsed.currentInterviewQuestionId);
      }
    } catch (e) {
      console.warn('Failed to restore SHIFT state from localStorage', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          extractedResume,
          gapAnalysis,
          learningTasks,
          interviewQuestions,
          latestEvaluation,
          metrics,
          currentStep,
          currentInterviewSessionId,
          currentInterviewQuestionId,
        })
      );
    } catch (e) {
      console.warn('Failed to persist SHIFT state to localStorage', e);
    }
  }, [
    profile,
    extractedResume,
    gapAnalysis,
    learningTasks,
    interviewQuestions,
    latestEvaluation,
    metrics,
    currentStep,
    currentInterviewSessionId,
    currentInterviewQuestionId,
  ]);

  // Run full analysis loop (Live Backend first -> Local deterministic fallback)
  const runAnalysis = async (overrideProfile?: UserCareerProfile) => {
    const activeProfile = overrideProfile || profile;
    setIsAnalyzing(true);
    const startTime = performance.now();

    let ext: ExtractedResume;
    let gap: GapAnalysisResult;
    let tasks: LearningTask[];
    let questions: InterviewQuestion[];

    // 1. Attempt Backend API (Live Gemini / Gemma)
    const apiResume = await fetchAnalyzeResume(
      activeProfile.resumeText,
      activeProfile.targetRole,
      activeProfile.experienceLevel
    );

    if (apiResume) {
      // Backend returned valid structured analysis
      const evalSkills = apiResume.allEvaluatedSkills || apiResume.skills || [];
      const demoSkills = apiResume.demonstratedSkills || evalSkills.filter(s => s.status === 'demonstrated');
      const gaps = apiResume.skillGaps || [];

      ext = {
        rawText: activeProfile.resumeText,
        candidateName: apiResume.candidateName || 'Alex Chen',
        summary: apiResume.rawAnalysis?.summary || '',
        education: [],
        experience: [],
        projects: (apiResume.rawAnalysis?.strengths || []).map((s: any) => ({
          name: s.title || 'Technical Project',
          description: s.explanation || '',
          technologies: [],
          evidenceSnippets: s.evidence ? [s.evidence] : [],
        })),
        extractedSkills: evalSkills.map((s: { name: string }) => s.name),
        strengths: apiResume.strengths,
        weakEvidenceAreas: gaps.map((g: { name: string; note?: string }) => `${g.name}: ${g.note || ''}`),
        missingCriticalInfo: apiResume.evidenceWarnings,
        truthfulSuggestions: apiResume.resumeImprovements,
      };

      gap = {
        demonstrated: demoSkills.map((s: { name: string; evidenceQuote?: string; note?: string }) => ({
          skill: s.name,
          category: 'core_technical',
          quality: 'demonstrated',
          evidenceExcerpt: s.evidenceQuote,
          explanation: s.note || '',
          importance: 'high',
        })),
        partial: evalSkills
          .filter((s: { status: string }) => s.status === 'partial')
          .map((s: { name: string; evidenceQuote?: string; note?: string }) => ({
            skill: s.name,
            category: 'core_technical',
            quality: 'partial',
            evidenceExcerpt: s.evidenceQuote,
            explanation: s.note || '',
            importance: 'high',
          })),
        missing: gaps.map((g: { name: string; note?: string }) => ({
          skill: g.name,
          category: 'core_technical',
          quality: 'missing',
          explanation: g.note || '',
          importance: 'critical',
        })),
        highPriorityGaps: gaps.map((g: { name: string; note?: string }) => ({
          skill: g.name,
          category: 'core_technical',
          quality: 'missing',
          explanation: g.note || '',
          importance: 'critical',
        })),
        overallReadinessScore: apiResume.overallReadinessScore,
        summary: apiResume.rawAnalysis?.summary || `Benchmark readiness evaluated at ${apiResume.overallReadinessScore}%.`,
      };

      const apiPath = await fetchGeneratePath(
        activeProfile.targetRole,
        activeProfile.weeklyHours,
        activeProfile.durationDays,
        apiResume.rawAnalysis
      );

      if (apiPath?.tasks?.length) {
        tasks = apiPath.tasks.map(t => ({
          id: t.id,
          title: t.title,
          skill: t.skill,
          priority: t.priority,
          estimatedHours: t.estimatedHours,
          dayNumber: t.dayNumber,
          reasonItMatters: t.reasonItMatters,
          learningAction: t.learningAction,
          practiceTask: t.practiceTask,
          expectedOutcome: t.expectedOutcome,
          completed: t.completed,
        }));
      } else {
        tasks = localGenerateLearningPath(
          gap,
          activeProfile.targetRole,
          activeProfile.weeklyHours,
          activeProfile.durationDays
        );
      }

      const apiQ = await fetchInterviewQuestion(activeProfile.targetRole, 1);
      if (apiQ) {
        setCurrentInterviewSessionId(apiQ.sessionId || null);
        setCurrentInterviewQuestionId(apiQ.questionId || null);
        questions = [
          {
            id: apiQ.questionId,
            targetRole: activeProfile.targetRole,
            question: apiQ.question,
            testedSkills: apiQ.testsSkills,
            contextRationale: apiQ.contextRationale,
            rubric: {
              relevanceCriteria: 'Directly addresses prompt with relevant context',
              evidenceCriteria: 'Provides concrete implementation details and evidence',
              clarityCriteria: 'Uses standard STAR structure and precise technical terms',
            },
            sampleAnswers: apiQ.sampleAnswers,
          },
        ];
      } else {
        questions = getInterviewQuestionsForProfile(activeProfile.targetRole, ext, gap);
      }
    } else {
      // 2. Deterministic local engine fallback
      const localAnalysis = localAnalyzeResume(activeProfile.resumeText, activeProfile.targetRole, {
        selfAssessment: activeProfile.selfAssessment,
        diagnosticScores: (activeProfile as any).extendedProfile?.diagnosticScores,
        durationDays: activeProfile.durationDays,
        disputedSkills,
        hiddenSkills,
        customSkills,
      });
      ext = localAnalysis.extractedResume;
      gap = localAnalysis.gapAnalysis;
      tasks = localGenerateLearningPath(
        gap,
        activeProfile.targetRole,
        activeProfile.weeklyHours,
        activeProfile.durationDays
      );
      questions = getInterviewQuestionsForProfile(activeProfile.targetRole, ext, gap);
    }

    // Always guarantee transparent multi-signal competency judgements
    if (!gap.judgements || gap.judgements.length === 0) {
      const baselineAnalysis = localAnalyzeResume(activeProfile.resumeText, activeProfile.targetRole, {
        selfAssessment: activeProfile.selfAssessment,
        diagnosticScores: (activeProfile as any).extendedProfile?.diagnosticScores,
        durationDays: activeProfile.durationDays,
        disputedSkills,
        hiddenSkills,
        customSkills,
      });
      gap.judgements = baselineAnalysis.gapAnalysis.judgements;
      gap.disputedSkills = disputedSkills;
      gap.hiddenSkills = hiddenSkills;
      gap.customSkills = customSkills;
    }

    const elapsed = Math.round(performance.now() - startTime);

    setExtractedResume(ext);
    setGapAnalysis(gap);
    setLearningTasks(tasks);
    setInterviewQuestions(questions);
    setCurrentQuestionIndex(0);
    setLatestEvaluation(null);
    setLatestAdaptiveEvent(null);

    setMetrics(prev => ({
      ...prev,
      analysisResponseTimeMs: elapsed,
      extractedSkillCount: ext.extractedSkills.length,
      actionableGapsCount: gap.highPriorityGaps.length,
      generatedTasksCount: tasks.length,
    }));

    setIsAnalyzing(false);
    setCurrentStep('analysis');
  };

  const loadDemoScenario = (presetId = 'prd_frontend_beginner') => {
    const preset = DEMO_PRESETS.find(p => p.id === presetId) || DEMO_PRESETS[0];
    setProfile(preset.profile);
    runAnalysis(preset.profile);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setLearningTasks(prev => {
      const updated = prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const target = updated.find(t => t.id === taskId);
      if (target) {
        patchTaskStatus(taskId, target.completed);
      }
      const completedCount = updated.filter(t => t.completed).length;
      setMetrics(m => ({ ...m, completedTasksCount: completedCount }));
      return updated;
    });
  };

  const submitInterviewAnswer = async (answer: string) => {
    if (!interviewQuestions.length) return;
    const currentQ = interviewQuestions[currentQuestionIndex];
    setIsEvaluating(true);

    const apiEval = await fetchInterviewEvaluate(
      currentQ.question,
      answer,
      profile.targetRole,
      currentQ.testedSkills,
      currentInterviewSessionId || undefined,
      currentInterviewQuestionId || undefined
    );

    if (apiEval && apiEval.dimensions) {
      const evalObj: InterviewEvaluation = {
        id: crypto.randomUUID(),
        questionId: currentQ.id,
        userAnswer: answer,
        evaluatedAt: new Date().toLocaleTimeString(),
        dimensions: apiEval.dimensions,
        overallScore: apiEval.overallScore,
        strengths: apiEval.strengths,
        weaknesses: apiEval.improvements,
        keyMissingElements: apiEval.missingEvidence,
        detectedSkillSignal: {
          skill: apiEval.skillSignals[0]?.skill || currentQ.testedSkills[0] || 'Component Architecture',
          previousState: 'partial',
          newState: apiEval.overallScore < 3.0 ? 'needs_practice' : 'demonstrated',
          explanation: apiEval.skillSignals[0]?.explanation || 'Evaluated technical signal',
        },
        adaptiveAction: {
          affectedTaskId: 'task-arch',
          taskTitle: apiEval.adaptiveAction.affectedTaskTitle,
          previousDay: apiEval.adaptiveAction.previousDay,
          newDay: apiEval.adaptiveAction.newDay,
          explanation: apiEval.adaptiveAction.explanation,
        },
      };

      // Reorganize learning tasks if adaptive shift occurred
      let updatedTasks = [...learningTasks];
      if (apiEval.adaptiveAction.triggerAdaptiveShift) {
        const taskIndex = updatedTasks.findIndex(
          t =>
            t.title.toLowerCase().includes(apiEval.adaptiveAction.affectedTaskTitle.toLowerCase()) ||
            t.skill.toLowerCase().includes(currentQ.testedSkills[0]?.toLowerCase() || '')
        );

        if (taskIndex !== -1) {
          const [affectedTask] = updatedTasks.splice(taskIndex, 1);
          affectedTask.dayNumber = apiEval.adaptiveAction.newDay;
          affectedTask.adaptedFromInterview = true;
          affectedTask.adaptationReason = apiEval.adaptiveAction.explanation;
          affectedTask.priority = 'High';
          updatedTasks.unshift(affectedTask);
        }

        const adaptiveEvent: AdaptiveEvent = {
          timestamp: new Date().toLocaleTimeString(),
          skillSignal: `${evalObj.detectedSkillSignal.skill} (Degraded: Needs Immediate Practice)`,
          taskMovedTitle: apiEval.adaptiveAction.affectedTaskTitle,
          fromPosition: `Day ${apiEval.adaptiveAction.previousDay}`,
          toPosition: `Day ${apiEval.adaptiveAction.newDay} (Top Priority)`,
          reason: apiEval.adaptiveAction.explanation,
        };
        setLatestAdaptiveEvent(adaptiveEvent);
        setMetrics(m => ({
          ...m,
          adaptiveUpdatesCount: m.adaptiveUpdatesCount + 1,
          interviewSessionsCompleted: m.interviewSessionsCompleted + 1,
        }));
      } else {
        setMetrics(m => ({
          ...m,
          interviewSessionsCompleted: m.interviewSessionsCompleted + 1,
        }));
      }

      setLatestEvaluation(evalObj);
      setEvaluationsHistory(prev => [evalObj, ...prev]);
      setLearningTasks(updatedTasks);
    } else {
      // Deterministic local fallback
      const { evaluation, updatedTasks } = localEvaluateInterviewAnswer(currentQ, answer, learningTasks);
      setLatestEvaluation(evaluation);
      setEvaluationsHistory(prev => [evaluation, ...prev]);
      setLearningTasks(updatedTasks);

      if (evaluation.overallScore < 3.0) {
        const adaptiveEvent: AdaptiveEvent = {
          timestamp: new Date().toLocaleTimeString(),
          skillSignal: `${evaluation.detectedSkillSignal.skill} (Degraded: Needs Immediate Practice)`,
          taskMovedTitle: evaluation.adaptiveAction.taskTitle,
          fromPosition: `Day ${evaluation.adaptiveAction.previousDay}`,
          toPosition: `Day ${evaluation.adaptiveAction.newDay} (Top Priority)`,
          reason: evaluation.adaptiveAction.explanation,
        };
        setLatestAdaptiveEvent(adaptiveEvent);
        setMetrics(m => ({
          ...m,
          adaptiveUpdatesCount: m.adaptiveUpdatesCount + 1,
          interviewSessionsCompleted: m.interviewSessionsCompleted + 1,
        }));
      } else {
        setMetrics(m => ({
          ...m,
          interviewSessionsCompleted: m.interviewSessionsCompleted + 1,
        }));
      }
    }

    setIsEvaluating(false);
    setCurrentStep('feedback');
  };

  const clearAdaptiveBanner = () => {
    setLatestAdaptiveEvent(null);
  };

  const updateSkillSelfRating = (skillName: string, level: number) => {
    const updated = {
      ...(profile.selfAssessment || {}),
      [skillName]: level,
      [skillName.toLowerCase()]: level,
    };
    const nextProfile = {
      ...profile,
      selfAssessment: updated,
    };
    setProfile(nextProfile);
    saveUserProfile(nextProfile);
    runAnalysis(nextProfile);
  };

  const disputeSkillEvidence = (skillName: string) => {
    const nextDisputed = disputedSkills.includes(skillName)
      ? disputedSkills.filter(s => s !== skillName)
      : [...disputedSkills, skillName];
    setDisputedSkills(nextDisputed);
    setTimeout(() => runAnalysis(profile), 50);
  };

  const hideSkill = (skillName: string) => {
    const nextHidden = [...hiddenSkills, skillName];
    setHiddenSkills(nextHidden);
    setTimeout(() => runAnalysis(profile), 50);
  };

  const unhideSkill = (skillName: string) => {
    const nextHidden = hiddenSkills.filter(s => s !== skillName);
    setHiddenSkills(nextHidden);
    setTimeout(() => runAnalysis(profile), 50);
  };

  const addCustomSkill = (
    skillName: string,
    category: string,
    requiredLevel: number,
    selfLevel: number,
    projectExcerpt?: string
  ) => {
    const customResult = evaluateSkill({
      skillId: skillName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      skillName,
      category,
      requiredLevel,
      importance: 'high',
      signals: {
        selfAssessmentScore: selfLevel,
        resumeEvidenceScore: projectExcerpt ? 3.0 : 1.0,
        evidenceExcerpt: projectExcerpt,
        isRecent: true,
      },
      durationDays: profile.durationDays,
      benchmarkDescription: `User-defined technical competency: ${skillName}.`,
      isCustomSkill: true,
    });

    setCustomSkills(prev => [...prev.filter(s => s.skillName !== skillName), customResult]);
    setTimeout(() => runAnalysis(profile), 50);
  };

  const recalculatePath = () => {
    runAnalysis(profile);
  };

  useEffect(() => {
    if (learningTasks.length > 0) {
      const { blocks, milestones } = generateDeterministicSchedule(learningTasks, roadmapPreferences);
      setScheduleBlocks(blocks);
      setWeeklyMilestones(milestones);
    }
  }, [learningTasks, roadmapPreferences]);

  const changeTargetRole = (roleId: string, roleTitle: string) => {
    const nextProfile = {
      ...profile,
      targetRole: roleId,
      targetRoleTitle: roleTitle,
    };
    const roleObj = getRoleById(roleId);
    setSelectedRole(roleObj);
    setRoadmapPreferences(prev => ({ ...prev, targetRoleId: roleId }));
    setProfile(nextProfile);
    saveUserProfile(nextProfile);
    runAnalysis(nextProfile);
  };

  const resetWorkspace = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(defaultProfile);
    setExtractedResume(null);
    setGapAnalysis(null);
    setLearningTasks([]);
    setInterviewQuestions([]);
    setLatestEvaluation(null);
    setLatestAdaptiveEvent(null);
    setEvaluationsHistory([]);
    setCurrentQuestionIndex(0);
    setCurrentInterviewSessionId(null);
    setCurrentInterviewQuestionId(null);
    setMetrics(initialMetrics);
    setDisputedSkills([]);
    setHiddenSkills([]);
    setCustomSkills([]);
    setTechnicalAssessmentResult(null);
    setBehavioralAssessmentResult(null);
    setCurrentStep('landing');
  };

  return (
    <ShiftContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        profile,
        setProfile,
        extractedResume,
        gapAnalysis,
        learningTasks,
        interviewQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        latestEvaluation,
        evaluationsHistory,
        latestAdaptiveEvent,
        metrics,
        isAnalyzing,
        isEvaluating,
        activeBackendMode,
        aiProviderName,
        currentInterviewSessionId,
        currentInterviewQuestionId,
        user,
        isAuthLoading,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        firstVisitModalOpen,
        setFirstVisitModalOpen,
        openAuthModal,
        closeAuthModal,
        dismissFirstVisitModal,
        loadUserProfileFromSupabase,
        saveUserProfile,
        signOut,
        loadDemoScenario,
        runAnalysis,
        toggleTaskCompletion,
        submitInterviewAnswer,
        resetWorkspace,
        clearAdaptiveBanner,
        disputedSkills,
        hiddenSkills,
        customSkills,
        updateSkillSelfRating,
        disputeSkillEvidence,
        addCustomSkill,
        hideSkill,
        unhideSkill,
        recalculatePath,
        changeTargetRole,
        selectedRole,
        setSelectedRole,
        bookmarkedRoleIds,
        toggleBookmarkRole,
        roadmapPreferences,
        setRoadmapPreferences,
        scheduleBlocks,
        weeklyMilestones,
        recalculateSchedule,
        technicalAssessmentResult,
        setTechnicalAssessmentResult,
        behavioralAssessmentResult,
        setBehavioralAssessmentResult,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = (): ShiftContextType => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error('useShift must be used within a ShiftProvider');
  }
  return context;
};
