import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { getDiagnosticQuestionsForRole } from '../data/diagnosticQuestions';
import type { DiagnosticQuestion } from '../data/diagnosticQuestions';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface DiagnosticAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCompleted?: (scores: Record<string, number>) => void;
}

export const DiagnosticAssessmentModal: React.FC<DiagnosticAssessmentModalProps> = ({
  isOpen,
  onClose,
  onAssessmentCompleted,
}) => {
  const { profile, setProfile, runAnalysis } = useShift();
  const questions: DiagnosticQuestion[] = getDiagnosticQuestionsForRole(profile.targetRole);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || questions[0];
  const selectedOptionId = selectedAnswers[currentQ.id];
  const isQuestionSubmitted = Boolean(submittedQuestions[currentQ.id]);

  const handleSelectOption = (optionId: string) => {
    if (isQuestionSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleSubmitCurrent = () => {
    if (!selectedOptionId) return;
    setSubmittedQuestions(prev => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate skill-specific diagnostic scores
      const diagnosticScores: Record<string, number> = {};

      questions.forEach(q => {
        const chosenId = selectedAnswers[q.id];
        const chosenOpt = q.options.find(o => o.id === chosenId);
        const isCorrect = chosenOpt?.isCorrect ?? false;
        // Correct answer yields 4.5/5.0 score; incorrect yields 1.5/5.0 (indicates exposure but partial gap)
        const score = isCorrect ? 4.5 : 1.5;
        diagnosticScores[q.skillId] = score;
        diagnosticScores[q.skillName] = score;
      });

      // Persist in profile
      setProfile(prev => ({
        ...prev,
        extendedProfile: {
          ...((prev as any).extendedProfile || {}),
          diagnosticScores,
          diagnosticCompletedAt: new Date().toISOString(),
        },
      }));

      setIsCompleted(true);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(diagnosticScores);
      }
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const totalCorrect = questions.filter(q => {
    const chosen = q.options.find(o => o.id === selectedAnswers[q.id]);
    return chosen?.isCorrect;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#101416] border border-[rgba(250,243,225,0.18)] rounded-[28px] p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#FF6D1F] to-transparent" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(250,243,225,0.1)] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6D1F] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6D1F] font-bold">
              Auxiliary Concept Diagnostic
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#FAF3E1]/60 hover:text-[#FAF3E1] hover:bg-[#222222] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assessment In-Progress */}
        {!isCompleted ? (
          <div className="flex-1 overflow-y-auto pr-1">
            {/* Disclaimer pill */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#222222]/50 border border-[rgba(250,243,225,0.1)] text-xs text-[#FAF3E1]/70 mb-5">
              <HelpCircle className="w-4 h-4 text-[#FF6D1F] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Self-Calibration Check:</strong> This is not an exam. It tests fundamental concepts to elevate your evidence confidence score and detect blind spots.
              </span>
            </div>

            {/* Progress Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-[#96928A] mb-3">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-[#FF6D1F] font-semibold">{currentQ.skillName}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-[#FF6D1F] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Scenario and Question */}
            <div className="mb-6">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#222222] text-[#FAF3E1]/80 font-mono text-[11px] mb-2">
                Scenario: {currentQ.scenario}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#FAF3E1] leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle = 'border-[rgba(250,243,225,0.12)] bg-[#171C1F] hover:border-[#FF6D1F]/50';

                if (isQuestionSubmitted) {
                  if (option.isCorrect) {
                    optionStyle = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-200';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'border-red-500/80 bg-red-950/20 text-red-200';
                  } else {
                    optionStyle = 'border-[rgba(250,243,225,0.06)] bg-[#121618] opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[#FF6D1F] bg-[#FF6D1F]/10 text-[#FAF3E1] shadow-lg shadow-[#FF6D1F]/10';
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 border ${
                        isSelected 
                          ? 'border-[#FF6D1F] bg-[#FF6D1F] text-[#222222]' 
                          : 'border-[rgba(250,243,225,0.2)] text-[#FAF3E1]/60'
                      }`}>
                        {option.id.toUpperCase()}
                      </span>
                      <p className="text-sm font-sans flex-1 text-[#FAF3E1]">
                        {option.text}
                      </p>
                    </div>

                    {isQuestionSubmitted && (
                      <div className="mt-2 pt-2 border-t border-[rgba(250,243,225,0.08)] pl-8 text-xs font-sans text-[#FAF3E1]/80">
                        <strong className={option.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                          {option.isCorrect ? 'Key Takeaway: ' : 'Why this is suboptimal: '}
                        </strong>
                        {option.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[rgba(250,243,225,0.1)]">
              <span className="text-xs text-[#96928A] font-mono">
                Concept: {currentQ.conceptTested}
              </span>

              {!isQuestionSubmitted ? (
                <button
                  onClick={handleSubmitCurrent}
                  disabled={!selectedOptionId}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition ${
                    selectedOptionId
                      ? 'bg-[#FF6D1F] text-[#222222] hover:bg-[#ff7e36] cursor-pointer'
                      : 'bg-[#222222] text-[#96928A] cursor-not-allowed opacity-60'
                  }`}
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#FAF3E1] hover:bg-white text-[#222222] text-xs font-mono font-bold uppercase flex items-center gap-2 transition cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="flex-1 flex flex-col justify-center items-center text-center py-6 px-4">
            <div className="w-16 h-16 rounded-full bg-[#FF6D1F]/20 border border-[#FF6D1F]/40 flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-[#FF6D1F]" />
            </div>

            <h3 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mb-2">
              Diagnostic Calibration Completed
            </h3>

            <p className="text-sm text-[#FAF3E1]/70 max-w-md mb-6 font-sans">
              You scored <strong className="text-[#FF6D1F]">{totalCorrect} / {questions.length}</strong> concepts correct. Your independent diagnostic score has updated your skill judgement matrix and strengthened evidence confidence!
            </p>

            <div className="w-full bg-[#171C1F] border border-[rgba(250,243,225,0.12)] rounded-2xl p-4 mb-6 text-left">
              <div className="text-xs font-mono text-[#FF6D1F] uppercase font-bold mb-2">
                Calibrated Signal Impacts:
              </div>
              <ul className="space-y-1.5 text-xs text-[#FAF3E1]/80 font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Integrated diagnostic assessment signal (weight: 30%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
                  <span>Increased confidence tier for validated technical competencies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Saved calibrated scores directly to your active profile</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#222222] hover:bg-[#2c3338] text-[#FAF3E1] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Diagnostic</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  runAnalysis();
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-[#FF6D1F]/20"
              >
                APPLY & RECALCULATE ROADMAP →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
