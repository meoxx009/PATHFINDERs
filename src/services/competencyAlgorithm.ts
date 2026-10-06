/**
 * SkillForge AI — Transparent Competency & Multi-Signal Skill Judgement Engine
 *
 * Implements a transparent, explainable scoring model across:
 * 1. User self-assessment
 * 2. Resume evidence
 * 3. Project evidence
 * 4. Diagnostic assessment questions
 * 5. Interview response signals
 * 6. Completed roadmap tasks
 * 7. Portfolio / links evidence
 */

export type SkillEvidenceState =
  | 'not_observed'
  | 'claimed'
  | 'coursework_only'
  | 'partial_evidence'
  | 'project_demonstrated'
  | 'industry_evidence'
  | 'validated_by_assessment';

export type ConfidenceTier = 'high_confidence' | 'medium_confidence' | 'needs_validation';

export type GapPriorityLabel =
  | 'Critical next step'
  | 'High priority'
  | 'Important'
  | 'Useful later'
  | 'Already supported';

export interface SignalInputs {
  selfAssessmentScore?: number;       // 0 to 5
  resumeEvidenceScore?: number;       // 0 to 5
  diagnosticScore?: number;           // 0 to 5
  interviewSignalScore?: number;      // 0 to 5
  taskCompletionScore?: number;       // 0 to 5
  evidenceExcerpt?: string;
  evidenceSource?: 'resume' | 'project' | 'coursework' | 'internship' | 'interview' | 'diagnostic' | 'user';
  isRecent?: boolean;
}

export interface WeightProfile {
  resumeEvidence: number;      // default: 0.35
  diagnosticAssessment: number;// default: 0.30
  interviewSignal: number;     // default: 0.20
  selfAssessment: number;      // default: 0.10
  taskCompletion: number;      // default: 0.05
}

export const DEFAULT_WEIGHTS: WeightProfile = {
  resumeEvidence: 0.35,
  diagnosticAssessment: 0.30,
  interviewSignal: 0.20,
  selfAssessment: 0.10,
  taskCompletion: 0.05,
};

export interface ConfidenceBreakdown {
  tier: ConfidenceTier;
  confidenceScore: number; // 0 to 100
  signalCount: number;
  qualityBonus: number;
  recencyBonus: number;
  conflictPenalty: number;
  explanation: string;
  validationRecommendation?: string;
}

export interface SkillJudgementResult {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;             // 0.0 to 5.0
  requiredLevel: number;            // 0 to 5
  skillGap: number;                 // 0.0 to 1.0 (relative gap)
  gapPriorityScore: number;
  priorityLabel: GapPriorityLabel;
  evidenceState: SkillEvidenceState;
  evidenceExcerpt?: string;
  confidence: ConfidenceBreakdown;
  activeSignals: {
    selfAssessment?: number;
    resumeEvidence?: number;
    diagnosticScore?: number;
    interviewSignal?: number;
    taskCompletion?: number;
  };
  normalizedWeights: {
    selfAssessment: number;
    resumeEvidence: number;
    diagnosticAssessment: number;
    interviewSignal: number;
    taskCompletion: number;
  };
  whyItMatters: string;
  howToValidate: string;
  recommendedTask: string;
  isCustomSkill?: boolean;
  userDisputed?: boolean;
  userHidden?: boolean;
}

/**
 * Maps raw evidence observation into a standardized 0 to 5 score
 * and evidence state according to PRD criteria:
 * - No mention: 0.0 ('not_observed')
 * - Keyword / claim only: 1.0 ('claimed')
 * - Course / assignment: 2.0 ('coursework_only')
 * - Academic / personal project: 3.0 ('project_demonstrated' or 'partial_evidence')
 * - Internship / deployed: 4.0 ('industry_evidence')
 * - Repeated professional: 5.0 ('industry_evidence')
 */
export function classifyEvidenceScore(
  score: number,
  hasExcerpt: boolean
): { score: number; state: SkillEvidenceState } {
  const boundedScore = Math.max(0, Math.min(5, score));

  // A model must include an evidence excerpt when assigning a score above 1.0
  const adjustedScore = (!hasExcerpt && boundedScore > 1.0) ? 1.0 : boundedScore;

  let state: SkillEvidenceState = 'not_observed';
  if (adjustedScore <= 0.2) {
    state = 'not_observed';
  } else if (adjustedScore <= 1.2) {
    state = 'claimed';
  } else if (adjustedScore <= 2.2) {
    state = 'coursework_only';
  } else if (adjustedScore <= 3.2) {
    state = 'project_demonstrated';
  } else if (adjustedScore <= 4.5) {
    state = 'industry_evidence';
  } else {
    state = 'industry_evidence';
  }

  return { score: adjustedScore, state };
}

/**
 * Calculates weighted proficiency with dynamic weight normalization.
 * If a signal is missing, normalize remaining weights instead of treating it as zero.
 */
export function calculateProficiencyScore(
  signals: SignalInputs,
  customWeights: WeightProfile = DEFAULT_WEIGHTS
): { currentLevel: number; normalizedWeights: Record<keyof WeightProfile, number> } {
  let totalAvailableWeight = 0;

  const hasResume = signals.resumeEvidenceScore !== undefined && !isNaN(signals.resumeEvidenceScore);
  const hasDiagnostic = signals.diagnosticScore !== undefined && !isNaN(signals.diagnosticScore);
  const hasInterview = signals.interviewSignalScore !== undefined && !isNaN(signals.interviewSignalScore);
  const hasSelf = signals.selfAssessmentScore !== undefined && !isNaN(signals.selfAssessmentScore);
  const hasTask = signals.taskCompletionScore !== undefined && !isNaN(signals.taskCompletionScore);

  if (hasResume) totalAvailableWeight += customWeights.resumeEvidence;
  if (hasDiagnostic) totalAvailableWeight += customWeights.diagnosticAssessment;
  if (hasInterview) totalAvailableWeight += customWeights.interviewSignal;
  if (hasSelf) totalAvailableWeight += customWeights.selfAssessment;
  if (hasTask) totalAvailableWeight += customWeights.taskCompletion;

  if (totalAvailableWeight === 0) {
    return {
      currentLevel: 0,
      normalizedWeights: {
        resumeEvidence: 0,
        diagnosticAssessment: 0,
        interviewSignal: 0,
        selfAssessment: 0,
        taskCompletion: 0,
      },
    };
  }

  const normWeights = {
    resumeEvidence: hasResume ? customWeights.resumeEvidence / totalAvailableWeight : 0,
    diagnosticAssessment: hasDiagnostic ? customWeights.diagnosticAssessment / totalAvailableWeight : 0,
    interviewSignal: hasInterview ? customWeights.interviewSignal / totalAvailableWeight : 0,
    selfAssessment: hasSelf ? customWeights.selfAssessment / totalAvailableWeight : 0,
    taskCompletion: hasTask ? customWeights.taskCompletion / totalAvailableWeight : 0,
  };

  const currentLevel =
    (hasResume ? (signals.resumeEvidenceScore! * normWeights.resumeEvidence) : 0) +
    (hasDiagnostic ? (signals.diagnosticScore! * normWeights.diagnosticAssessment) : 0) +
    (hasInterview ? (signals.interviewSignalScore! * normWeights.interviewSignal) : 0) +
    (hasSelf ? (signals.selfAssessmentScore! * normWeights.selfAssessment) : 0) +
    (hasTask ? (signals.taskCompletionScore! * normWeights.taskCompletion) : 0);

  // Return level bounded between 0 and 5, rounded to 1 decimal place
  return {
    currentLevel: Math.round(Math.max(0, Math.min(5, currentLevel)) * 10) / 10,
    normalizedWeights: normWeights,
  };
}

/**
 * Calculates Confidence separately from Proficiency.
 * High confidence requires independent signals, evidence quality, and consensus.
 * Disagreements between self-assessment and practical/diagnostic signals apply conflict penalties.
 */
export function calculateConfidence(
  signals: SignalInputs,
  proficiencyScore: number
): ConfidenceBreakdown {
  let signalCount = 0;
  if (signals.selfAssessmentScore !== undefined) signalCount++;
  if (signals.resumeEvidenceScore !== undefined) signalCount++;
  if (signals.diagnosticScore !== undefined) signalCount++;
  if (signals.interviewSignalScore !== undefined) signalCount++;
  if (signals.taskCompletionScore !== undefined) signalCount++;

  if (signalCount === 0) {
    return {
      tier: 'needs_validation',
      confidenceScore: 0,
      signalCount: 0,
      qualityBonus: 0,
      recencyBonus: 0,
      conflictPenalty: 0,
      explanation: 'No evidence or self-assessment signals detected yet.',
      validationRecommendation: 'Complete self-assessment or add resume evidence to establish baseline confidence.',
    };
  }

  // Base confidence based on number of independent signals
  // 1 signal: 35%, 2 signals: 60%, 3 signals: 80%, 4+: 95%
  let baseConfidence = 0;
  switch (signalCount) {
    case 1: baseConfidence = 35; break;
    case 2: baseConfidence = 60; break;
    case 3: baseConfidence = 80; break;
    default: baseConfidence = 95; break;
  }

  // Quality bonus (verifiable project/internship/diagnostic evidence)
  let qualityBonus = 0;
  if (signals.diagnosticScore !== undefined && signals.diagnosticScore > 0) qualityBonus += 10;
  if (signals.resumeEvidenceScore !== undefined && signals.resumeEvidenceScore >= 3.0) qualityBonus += 10;
  if (signals.interviewSignalScore !== undefined && signals.interviewSignalScore >= 3.0) qualityBonus += 10;

  // Recency bonus
  let recencyBonus = 0;
  if (signals.isRecent) recencyBonus += 8;

  // Conflict penalty calculation:
  // e.g. Self-assessment says 5.0, but resume/diagnostic only shows 1.0
  let conflictPenalty = 0;
  if (signals.selfAssessmentScore !== undefined && signals.resumeEvidenceScore !== undefined) {
    const diff = Math.abs(signals.selfAssessmentScore - signals.resumeEvidenceScore);
    if (diff >= 2.5) {
      conflictPenalty += Math.min(35, diff * 12);
    }
  }

  if (signals.selfAssessmentScore !== undefined && signals.diagnosticScore !== undefined) {
    const diffDiag = Math.abs(signals.selfAssessmentScore - signals.diagnosticScore);
    if (diffDiag >= 2.0) {
      conflictPenalty += Math.min(30, diffDiag * 10);
    }
  }

  let finalConfidenceScore = Math.max(10, Math.min(100, Math.round(baseConfidence + qualityBonus + recencyBonus - conflictPenalty)));

  // If only 1 signal exists, maximum tier is medium_confidence (never high without secondary proof)
  if (signalCount === 1 && finalConfidenceScore > 50) {
    finalConfidenceScore = 50;
  }

  let tier: ConfidenceTier = 'needs_validation';
  if (finalConfidenceScore >= 75) {
    tier = 'high_confidence';
  } else if (finalConfidenceScore >= 45) {
    tier = 'medium_confidence';
  } else {
    tier = 'needs_validation';
  }

  let explanation = '';
  let validationRecommendation: string | undefined;

  if (conflictPenalty > 15) {
    explanation = 'Divergence detected between self-assessment and practical demonstration evidence.';
    validationRecommendation = 'Take the 3-minute diagnostic test or answer an interview question to corroborate your experience.';
  } else if (tier === 'high_confidence') {
    explanation = `Multi-signal consensus verified across ${signalCount} independent checkpoints with high evidence consistency.`;
  } else if (tier === 'medium_confidence') {
    explanation = `Moderate confidence based on ${signalCount} signal(s). Adding code links or interview evidence will elevate credibility.`;
    if (proficiencyScore >= 3.0) {
      validationRecommendation = 'Demonstrate this competency in an interview practice answer to achieve full validation.';
    }
  } else {
    explanation = `Preliminary rating with limited independent corroboration (${signalCount} signal).`;
    validationRecommendation = proficiencyScore >= 3.0
      ? 'High claimed level lacks external verification. Complete diagnostic questions or link a live repository.'
      : 'Review introductory coursework or build a dedicated practice component.';
  }

  return {
    tier,
    confidenceScore: finalConfidenceScore,
    signalCount,
    qualityBonus,
    recencyBonus,
    conflictPenalty,
    explanation,
    validationRecommendation,
  };
}

/**
 * Calculates Skill Gap and Priority Formula:
 * skill_gap = max(0, required_level - current_level) / required_level
 * gap_priority = skill_gap × role_importance × dependency_weight × goal_urgency
 */
export function calculateSkillGapPriority(params: {
  currentLevel: number;
  requiredLevel: number;
  importance: 'critical' | 'high' | 'medium';
  isPrerequisite?: boolean;
  durationDays?: number; // 7, 14, 30
}): {
  skillGap: number;
  gapPriorityScore: number;
  priorityLabel: GapPriorityLabel;
} {
  const { currentLevel, requiredLevel, importance, isPrerequisite = false, durationDays = 14 } = params;

  if (requiredLevel <= 0) {
    return {
      skillGap: 0,
      gapPriorityScore: 0,
      priorityLabel: 'Already supported',
    };
  }

  const rawGap = Math.max(0, requiredLevel - currentLevel);
  const skillGap = Math.round((rawGap / requiredLevel) * 100) / 100;

  if (skillGap === 0) {
    return {
      skillGap: 0,
      gapPriorityScore: 0,
      priorityLabel: 'Already supported',
    };
  }

  // Multipliers
  const importanceWeight = importance === 'critical' ? 2.0 : importance === 'high' ? 1.5 : 1.0;
  const dependencyWeight = isPrerequisite ? 1.4 : 1.0;
  // Urgency: 7-day sprint has highest compression
  const goalUrgency = durationDays <= 7 ? 1.3 : durationDays <= 14 ? 1.15 : 1.0;

  const gapPriorityScore = Math.round(skillGap * importanceWeight * dependencyWeight * goalUrgency * 100) / 100;

  let priorityLabel: GapPriorityLabel = 'Useful later';
  if (gapPriorityScore >= 2.0 || (importance === 'critical' && skillGap >= 0.5)) {
    priorityLabel = 'Critical next step';
  } else if (gapPriorityScore >= 1.3) {
    priorityLabel = 'High priority';
  } else if (gapPriorityScore >= 0.6) {
    priorityLabel = 'Important';
  } else if (gapPriorityScore > 0) {
    priorityLabel = 'Useful later';
  } else {
    priorityLabel = 'Already supported';
  }

  return {
    skillGap,
    gapPriorityScore,
    priorityLabel,
  };
}

/**
 * Full Multi-Signal Skill Judgement Evaluator
 */
export function evaluateSkill(params: {
  skillId: string;
  skillName: string;
  category: string;
  requiredLevel: number;
  importance: 'critical' | 'high' | 'medium';
  signals: SignalInputs;
  isPrerequisite?: boolean;
  durationDays?: number;
  benchmarkDescription?: string;
  isCustomSkill?: boolean;
}): SkillJudgementResult {
  const {
    skillId,
    skillName,
    category,
    requiredLevel,
    importance,
    signals,
    isPrerequisite = false,
    durationDays = 14,
    benchmarkDescription = 'Core engineering competency required for target role benchmarks.',
    isCustomSkill = false,
  } = params;

  // 1. Evidence state classification
  let evidenceState: SkillEvidenceState = 'not_observed';
  if (signals.diagnosticScore && signals.diagnosticScore >= 3.5) {
    evidenceState = 'validated_by_assessment';
  } else if (signals.resumeEvidenceScore !== undefined) {
    const classification = classifyEvidenceScore(signals.resumeEvidenceScore, Boolean(signals.evidenceExcerpt));
    evidenceState = classification.state;
  } else if (signals.selfAssessmentScore !== undefined && signals.selfAssessmentScore > 0) {
    evidenceState = 'claimed';
  }

  // 2. Proficiency calculation
  const { currentLevel, normalizedWeights } = calculateProficiencyScore(signals);

  // 3. Confidence calculation
  const confidence = calculateConfidence(signals, currentLevel);

  // 4. Gap and priority
  const { skillGap, gapPriorityScore, priorityLabel } = calculateSkillGapPriority({
    currentLevel,
    requiredLevel,
    importance,
    isPrerequisite,
    durationDays,
  });

  // 5. Why it matters & validation steps
  const whyItMatters = benchmarkDescription;
  const howToValidate = confidence.validationRecommendation || 
    `Implement a production project feature utilizing ${skillName} with measurable metrics, or answer an interview question.`;
  const recommendedTask = skillGap > 0
    ? `Complete a hands-on lab on ${skillName} focusing on real-world constraints and architectural edge cases.`
    : `Maintain proficiency with advanced ${skillName} architectural trade-offs in mock interview rounds.`;

  return {
    skillId,
    skillName,
    category,
    currentLevel,
    requiredLevel,
    skillGap,
    gapPriorityScore,
    priorityLabel,
    evidenceState,
    evidenceExcerpt: signals.evidenceExcerpt,
    confidence,
    activeSignals: {
      selfAssessment: signals.selfAssessmentScore,
      resumeEvidence: signals.resumeEvidenceScore,
      diagnosticScore: signals.diagnosticScore,
      interviewSignal: signals.interviewSignalScore,
      taskCompletion: signals.taskCompletionScore,
    },
    normalizedWeights,
    whyItMatters,
    howToValidate,
    recommendedTask,
    isCustomSkill,
  };
}
