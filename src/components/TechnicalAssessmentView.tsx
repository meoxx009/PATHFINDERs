import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight
} from 'lucide-react';
import { useShift } from '../context/ShiftContext';
import { getQuestionsForRole } from '../data/assessmentBank';
import type { TechnicalAssessmentResult } from '../types';

export const TechnicalAssessmentView: React.FC = () => {
  const {
    profile,
    selectedRole,
    setCurrentStep,
    setTechnicalAssessmentResult,
    technicalAssessmentResult
  } = useShift();

  const roleId = selectedRole?.id || profile.targetRole;
  const roleTitle = selectedRole?.title || profile.targetRoleTitle || 'Engineering Role';

  const questions = getQuestionsForRole(roleId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<TechnicalAssessmentResult | null>(technicalAssessmentResult);

  const currentQ = questions[currentIndex];
  const userSelected = selectedAnswers[currentQ?.id] || [];
  const hasAnsweredCurrent = userSelected.length > 0;

  const handleSelectOption = (index: number) => {
    if (showExplanation) return; // Prevent changing after revealing
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: [index] // single choice for now
    }));
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final results
      finishAssessment();
    }
  };

  const finishAssessment = () => {
    let correctCount = 0;
    const answersRecord: TechnicalAssessmentResult['answers'] = [];
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    questions.forEach(q => {
      const selected = selectedAnswers[q.id] || [];
      const isCorrect = q.correctAnswers.length === selected.length &&
        q.correctAnswers.every(ans => selected.includes(ans));

      if (isCorrect) {
        correctCount++;
        strongTopics.push(q.skillName);
      } else {
        weakTopics.push(q.skillName);
      }

      answersRecord.push({
        questionId: q.id,
        selectedOptions: selected,
        isCorrect
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const estimatedLevel = Math.min(5, Math.max(1, Math.round((scorePercentage / 20))));
    const confidence = scorePercentage >= 75 ? 'High confidence' : scorePercentage >= 50 ? 'Medium confidence' : 'Needs validation';

    const result: TechnicalAssessmentResult = {
      roleId,
      roleTitle,
      scorePercentage,
      totalQuestions: questions.length,
      correctCount,
      estimatedLevel,
      confidence,
      weakTopics,
      strongTopics,
      recommendedNextTask: weakTopics.length > 0
        ? `Focus next sprint on reinforcing: ${weakTopics.slice(0, 2).join(' & ')}.`
        : 'Demonstrates solid foundational readiness; proceed to advanced project execution.',
      answers: answersRecord,
      completedAt: new Date().toISOString()
    };

    setFinalResult(result);
    setTechnicalAssessmentResult(result);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep('roles')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF3E1]/70 hover:text-[#FAF3E1] bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roles</span>
        </button>

        <div className="text-xs font-medium text-[#FAF3E1]/60">
          Role Diagnostic: <strong className="text-[#FAF3E1]">{roleTitle}</strong>
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-[#FAF3E1]/60">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="font-semibold text-[#FF6D1F]">{currentQ.skillName}</span>
            </div>
            <div className="w-full bg-[#080B0D] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF6D1F] h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario / Context */}
          {currentQ.scenarioText && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs leading-relaxed">
              <strong className="block text-blue-300 font-semibold mb-1">Engineering Scenario:</strong>
              {currentQ.scenarioText}
            </div>
          )}

          {/* Code Snippet if present */}
          {currentQ.codeSnippet && (
            <div className="bg-[#080B0D] border border-white/10 rounded-xl p-4 font-mono text-xs text-[#FAF3E1]/90 overflow-x-auto">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}

          {/* Question Text */}
          <h3 className="text-lg font-bold text-[#FAF3E1] leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = userSelected.includes(optIdx);
              const isCorrectAnswer = currentQ.correctAnswers.includes(optIdx);

              let optionStyle = 'bg-[#080B0D] border-white/10 text-[#FAF3E1]/90 hover:border-white/30';
              if (showExplanation) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-300';
                }
              } else if (isSelected) {
                optionStyle = 'bg-[#FF6D1F]/20 border-[#FF6D1F] text-[#FAF3E1]';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 text-xs leading-relaxed ${optionStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showExplanation && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {showExplanation && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs animate-in fade-in">
              <div className="font-bold text-[#FF6D1F]">
                Concept & Engineering Explanation:
              </div>
              <p className="text-[#FAF3E1]/80 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-[#FAF3E1]/60">
                <strong>Key Takeaway:</strong> {currentQ.conceptTakeaway}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {!showExplanation ? (
              <button
                type="button"
                disabled={!hasAnsweredCurrent}
                onClick={() => setShowExplanation(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#FAF3E1] transition"
              >
                Check Answer
              </button>
            ) : (
              <div className="text-xs text-[#FAF3E1]/50">Reviewed</div>
            )}

            <button
              type="button"
              disabled={!hasAnsweredCurrent}
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition flex items-center gap-2 shadow-md shadow-[#FF6D1F]/20"
            >
              <span>{currentIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#FAF3E1]">
              Technical Assessment Results: {roleTitle}
            </h2>
            <p className="text-xs text-[#FAF3E1]/60">
              Evaluated against industry benchmarks across {questions.length} diagnostic engineering questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-left">
            <div className="bg-[#080B0D] p-4 rounded-xl border border-white/5">
              <span className="text-[11px] text-[#FAF3E1]/50 uppercase tracking-wider block">Score</span>
              <span className="text-2xl font-extrabold text-[#FF6D1F]">
                {finalResult?.scorePercentage}%
              </span>
              <span className="text-xs text-[#FAF3E1]/60 block mt-1">
                {finalResult?.correctCount} / {questions.length} correct
              </span>
            </div>

            <div className="bg-[#080B0D] p-4 rounded-xl border border-white/5">
              <span className="text-[11px] text-[#FAF3E1]/50 uppercase tracking-wider block">Estimated Level</span>
              <span className="text-2xl font-extrabold text-[#FAF3E1]">
                Level {finalResult?.estimatedLevel} / 5
              </span>
              <span className="text-xs text-[#FAF3E1]/60 block mt-1">
                {finalResult?.confidence}
              </span>
            </div>

            <div className="bg-[#080B0D] p-4 rounded-xl border border-white/5">
              <span className="text-[11px] text-[#FAF3E1]/50 uppercase tracking-wider block">Adaptive Impact</span>
              <span className="text-xs font-semibold text-emerald-400 block mt-2">
                Roadmap adjusted to target your specific weak concepts.
              </span>
            </div>
          </div>

          {finalResult?.weakTopics && finalResult.weakTopics.length > 0 && (
            <div className="text-left bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs space-y-1">
              <strong className="text-amber-300 font-semibold block">Topics Requiring Reinforcement:</strong>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {finalResult.weakTopics.map(topic => (
                  <span key={topic} className="px-2.5 py-0.5 bg-[#080B0D] border border-amber-500/30 rounded text-amber-200">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FAF3E1] transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Diagnostic</span>
            </button>

            <button
              onClick={() => setCurrentStep('path')}
              className="px-6 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] text-xs font-bold text-white transition flex items-center gap-2 shadow-lg shadow-[#FF6D1F]/20"
            >
              <span>View Personalized Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
