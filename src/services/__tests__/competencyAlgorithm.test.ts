import { describe, it, expect } from 'vitest';
import {
  calculateProficiencyScore,
  calculateConfidence,
  calculateSkillGapPriority,
  classifyEvidenceScore,
  evaluateSkill,
} from '../competencyAlgorithm';

describe('SkillForge AI — Competency & Skill Judgement Engine', () => {
  describe('1. Proficiency Calculation & Dynamic Weight Normalization', () => {
    it('calculates weighted score when all 5 signals are present', () => {
      const signals = {
        resumeEvidenceScore: 4.0,       // weight: 0.35 -> 1.40
        diagnosticScore: 3.0,           // weight: 0.30 -> 0.90
        interviewSignalScore: 3.5,      // weight: 0.20 -> 0.70
        selfAssessmentScore: 4.0,       // weight: 0.10 -> 0.40
        taskCompletionScore: 5.0,       // weight: 0.05 -> 0.25
      };
      // Total = 1.40 + 0.90 + 0.70 + 0.40 + 0.25 = 3.65 -> rounds to 3.7
      const result = calculateProficiencyScore(signals);
      expect(result.currentLevel).toBe(3.7);
      expect(result.normalizedWeights.resumeEvidence).toBeCloseTo(0.35);
      expect(result.normalizedWeights.diagnosticAssessment).toBeCloseTo(0.30);
    });

    it('normalizes remaining weights when signals are missing', () => {
      // Only resume (0.35) and self-assessment (0.10) provided
      // Total available weight = 0.45
      // Normalized resume weight = 0.35 / 0.45 ≈ 0.7778
      // Normalized self weight = 0.10 / 0.45 ≈ 0.2222
      const signals = {
        resumeEvidenceScore: 3.0,
        selfAssessmentScore: 4.0,
      };
      const result = calculateProficiencyScore(signals);
      expect(result.currentLevel).toBe(3.2);
      expect(result.normalizedWeights.resumeEvidence).toBeCloseTo(0.35 / 0.45);
      expect(result.normalizedWeights.selfAssessment).toBeCloseTo(0.10 / 0.45);
      expect(result.normalizedWeights.diagnosticAssessment).toBe(0);
    });

    it('returns 0 when all signals are missing', () => {
      const result = calculateProficiencyScore({});
      expect(result.currentLevel).toBe(0);
      expect(result.normalizedWeights.resumeEvidence).toBe(0);
    });

    it('caps scores cleanly between 0.0 and 5.0', () => {
      const result = calculateProficiencyScore({ resumeEvidenceScore: 10.0 });
      expect(result.currentLevel).toBe(5.0);
    });
  });

  describe('2. Evidence State Classification & Excerpt Enforcement', () => {
    it('classifies evidence score with valid excerpt into appropriate state', () => {
      expect(classifyEvidenceScore(0.0, false).state).toBe('not_observed');
      expect(classifyEvidenceScore(1.0, true).state).toBe('claimed');
      expect(classifyEvidenceScore(2.0, true).state).toBe('coursework_only');
      expect(classifyEvidenceScore(3.0, true).state).toBe('project_demonstrated');
      expect(classifyEvidenceScore(4.0, true).state).toBe('industry_evidence');
    });

    it('caps score at 1.0 (claimed) if score is above 1.0 but excerpt is missing', () => {
      const result = classifyEvidenceScore(4.5, false);
      expect(result.score).toBe(1.0);
      expect(result.state).toBe('claimed');
    });
  });

  describe('3. Confidence Calculation & Conflict Penalties', () => {
    it('grants high confidence when multiple consistent signals exist', () => {
      const signals = {
        resumeEvidenceScore: 4.0,
        diagnosticScore: 4.0,
        interviewSignalScore: 4.0,
        selfAssessmentScore: 4.0,
        isRecent: true,
      };
      const conf = calculateConfidence(signals, 4.0);
      expect(conf.tier).toBe('high_confidence');
      expect(conf.confidenceScore).toBeGreaterThanOrEqual(75);
      expect(conf.conflictPenalty).toBe(0);
    });

    it('caps single signal at medium confidence even if score is high', () => {
      const signals = {
        resumeEvidenceScore: 5.0,
      };
      const conf = calculateConfidence(signals, 5.0);
      expect(conf.tier).toBe('medium_confidence');
      expect(conf.confidenceScore).toBeLessThanOrEqual(50);
    });

    it('applies conflict penalty and triggers validation recommendation when self-assessment disagrees with evidence', () => {
      const signals = {
        selfAssessmentScore: 5.0, // High claim
        resumeEvidenceScore: 1.0, // Only keyword / low evidence
        diagnosticScore: 1.0,     // Low diagnostic
      };
      const conf = calculateConfidence(signals, 2.5);
      expect(conf.conflictPenalty).toBeGreaterThan(15);
      expect(conf.tier).toBe('needs_validation');
      expect(conf.validationRecommendation).toBeDefined();
    });

    it('triggers a validation recommendation rather than rejection for low-confidence high score', () => {
      const signals = {
        selfAssessmentScore: 4.5,
      };
      const conf = calculateConfidence(signals, 4.5);
      expect(conf.tier).toBe('needs_validation');
      expect(conf.validationRecommendation).toContain('diagnostic');
    });
  });

  describe('4. Skill Gap & Priority Formula', () => {
    it('calculates skill gap correctly: max(0, required - current) / required', () => {
      const res = calculateSkillGapPriority({
        currentLevel: 2.0,
        requiredLevel: 4.0,
        importance: 'high',
      });
      // Gap: (4.0 - 2.0) / 4.0 = 0.5 (50%)
      expect(res.skillGap).toBe(0.5);
    });

    it('marks priority as "Already supported" when currentLevel >= requiredLevel', () => {
      const res = calculateSkillGapPriority({
        currentLevel: 4.5,
        requiredLevel: 4.0,
        importance: 'critical',
      });
      expect(res.skillGap).toBe(0);
      expect(res.priorityLabel).toBe('Already supported');
    });

    it('handles zero required level edge case', () => {
      const res = calculateSkillGapPriority({
        currentLevel: 2.0,
        requiredLevel: 0,
        importance: 'medium',
      });
      expect(res.skillGap).toBe(0);
      expect(res.priorityLabel).toBe('Already supported');
    });

    it('applies higher priority score for critical importance and compressed sprint urgency', () => {
      const standard = calculateSkillGapPriority({
        currentLevel: 1.0,
        requiredLevel: 4.0,
        importance: 'medium',
        durationDays: 30,
      });

      const urgentCritical = calculateSkillGapPriority({
        currentLevel: 1.0,
        requiredLevel: 4.0,
        importance: 'critical',
        isPrerequisite: true,
        durationDays: 7,
      });

      expect(urgentCritical.gapPriorityScore).toBeGreaterThan(standard.gapPriorityScore);
      expect(urgentCritical.priorityLabel).toBe('Critical next step');
    });
  });

  describe('5. Unknown Skills & Custom Skills Evaluation', () => {
    it('evaluates custom user-defined skills cleanly', () => {
      const result = evaluateSkill({
        skillId: 'custom_pytorch',
        skillName: 'PyTorch Deep Learning',
        category: 'ai_data',
        requiredLevel: 4,
        importance: 'high',
        signals: {
          selfAssessmentScore: 3.5,
          resumeEvidenceScore: 3.0,
          evidenceExcerpt: 'Trained CNN on CIFAR-10 in capstone lab',
        },
        isCustomSkill: true,
      });

      expect(result.skillName).toBe('PyTorch Deep Learning');
      expect(result.isCustomSkill).toBe(true);
      expect(result.currentLevel).toBeGreaterThan(2.5);
      expect(result.confidence.tier).toBeDefined();
    });

    it('handles unknown skill with default fallbacks without crashing', () => {
      const result = evaluateSkill({
        skillId: 'quantum_crypto',
        skillName: 'Quantum Cryptography',
        category: 'specialized',
        requiredLevel: 3,
        importance: 'medium',
        signals: {},
      });

      expect(result.currentLevel).toBe(0);
      expect(result.skillGap).toBe(1.0);
      expect(result.confidence.tier).toBe('needs_validation');
    });
  });
});
