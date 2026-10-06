import React, { useEffect } from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  RotateCcw, 
  Sparkles, 
  BarChart3 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterviewFeedbackView: React.FC = () => {
  const { 
    latestEvaluation, 
    setCurrentStep, 
    interviewQuestions, 
    submitInterviewAnswer, 
    loadDemoScenario, 
    isEvaluating,
    extractedResume 
  } = useShift();

  useEffect(() => {
    if (latestEvaluation && latestEvaluation.overallScore >= 4.0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [latestEvaluation]);

  if (!latestEvaluation) {
    return (
      <div className="max-w-[1280px] mx-auto py-16 px-6 text-center">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-10 max-w-lg mx-auto shadow-2xl">
          <BarChart3 className="w-12 h-12 text-[#FF6D1F] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
            No Interview Evaluation Yet
          </h2>
          <p className="text-xs text-[#96928A] mt-2 mb-6 leading-relaxed">
            Submit an answer in the Interview Coach to view structured 5-dimension rubric scores, gap signals, and the adaptive sprint adjustment.
          </p>

          <div className="flex flex-col gap-3">
            {extractedResume ? (
              <button
                onClick={() => setCurrentStep('interview')}
                className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer shadow-lg shadow-[#FF6D1F]/20"
              >
                GO TO INTERVIEW COACH →
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep('setup')}
                className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer shadow-lg shadow-[#FF6D1F]/20"
              >
                START CAREER SETUP →
              </button>
            )}

            <button
              disabled={isEvaluating}
              onClick={async () => {
                if (!extractedResume || interviewQuestions.length === 0) {
                  loadDemoScenario('prd_frontend_beginner');
                }
                // Simulate weak architecture interview answer for example journey
                await submitInterviewAnswer(
                  'I built a task tracker using HTML and JS. It lets you add tasks and click done. The code is in script.js and it was pretty easy to make.'
                );
              }}
              className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer font-display transition"
            >
              <Zap className="w-4 h-4 text-[#FF6D1F]" />
              <span>{isEvaluating ? 'Evaluating Journey...' : 'View an example evaluation journey'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAdaptiveShift = latestEvaluation.overallScore < 3.0;

  const dimensionCards = [
    { label: 'Relevance & Directness', data: latestEvaluation.dimensions.relevance },
    { label: 'Structure & STAR Flow', data: latestEvaluation.dimensions.structure },
    { label: 'Specificity & Detail', data: latestEvaluation.dimensions.specificity },
    { label: 'Implementation Evidence', data: latestEvaluation.dimensions.evidence },
    { label: 'Technical Clarity', data: latestEvaluation.dimensions.technicalClarity },
  ];

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(250,243,225,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
              Interview Evaluation & Feedback
            </span>
            <span className="text-[#96928A]">•</span>
            <span className="text-xs text-[#96928A]">Evaluated at {latestEvaluation.evaluatedAt}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
            Interview Evaluation & Adaptive Roadmap
          </h1>
          <p className="text-sm text-[#96928A] mt-2">
            Constructive assessment of your technical depth, evidence delivery, and communication framework.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep('path')}
          className="px-6 py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer self-start sm:self-center font-display shadow-lg shadow-[#FF6D1F]/20"
        >
          <span>VIEW ADAPTED LEARNING PATH →</span>
        </button>
      </div>

      {/* The Core Adaptive Update Spotlight */}
      {isAdaptiveShift ? (
        <div className="bg-[#101416] border-2 border-[#FF6D1F] rounded-[26px] p-8 sm:p-10 mb-8 shadow-2xl shadow-[#FF6D1F]/15">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6D1F]/20 border border-[#FF6D1F]/40 flex items-center justify-center text-[#FF6D1F] flex-shrink-0">
              <Zap className="w-7 h-7 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold uppercase tracking-wider text-[#FF6D1F]">
                  Your Next Move Adapted (Feedback Loop Active)
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold">
                  Adaptive Update
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-[#FAF3E1] mt-1.5">
                Practice This Next: {latestEvaluation.adaptiveAction.taskTitle}
              </h2>

              <p className="text-sm text-[#FAF3E1] mt-2 leading-relaxed">
                <strong className="text-[#FF6D1F]">This changed because…</strong> {latestEvaluation.adaptiveAction.explanation}
              </p>

              {/* Specific Signal Changes */}
              <div className="mt-5 pt-5 border-t border-[rgba(250,243,225,0.12)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#080B0D] p-4 rounded-[18px] border border-[rgba(250,243,225,0.12)]">
                  <span className="text-[#96928A] block text-[11px] mb-1">Competency Signal Shift:</span>
                  <span className="text-[#FF6D1F] font-bold text-sm">
                    {latestEvaluation.detectedSkillSignal.skill}
                  </span>
                  <span className="text-[#96928A] block mt-1 text-[11px]">
                    Status: <strong className="text-[#ED6A5A]">Needs Immediate Practice</strong>
                  </span>
                </div>

                <div className="bg-[#080B0D] p-4 rounded-[18px] border border-[rgba(250,243,225,0.12)]">
                  <span className="text-[#96928A] block text-[11px] mb-1">Sprint Priority Repositioning:</span>
                  <span className="text-[#FAF3E1] font-bold text-sm">
                    Day {latestEvaluation.adaptiveAction.previousDay} → <strong className="text-[#FF6D1F] underline">Day 1 (Immediate Next Step)</strong>
                  </span>
                  <span className="text-[#96928A] block mt-1 text-[11px]">
                    Priority elevated to <strong className="text-[#ED6A5A]">HIGH</strong>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setCurrentStep('path')}
                  className="px-8 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer font-display shadow-lg shadow-[#FF6D1F]/20"
                >
                  <span>SEE RE-ORDERED PATH ON DASHBOARD →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#101416] border border-[#B8D88A]/40 rounded-[26px] p-8 mb-8 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#B8D88A]/20 border border-[#B8D88A]/40 flex items-center justify-center text-[#B8D88A] flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold uppercase tracking-wider text-[#B8D88A]">
                  Interview Benchmark Validated
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#B8D88A]/20 text-[#B8D88A] font-bold">
                  Score: {latestEvaluation.overallScore} / 5.0
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-1">
                Strong Technical Articulation
              </h2>
              <p className="text-xs text-[#96928A] mt-1">
                {latestEvaluation.detectedSkillSignal.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5 Dimensions Rubric Breakdown */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-8 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(250,243,225,0.1)]">
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-[#FAF3E1] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#FF6D1F]" />
              5-Dimension Evaluation Breakdown
            </h2>
            <p className="text-xs text-[#96928A] mt-0.5">
              Structured rubric scoring across engineering hiring dimensions.
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-black text-[#FAF3E1]">
              {latestEvaluation.overallScore} <span className="text-xs text-[#96928A]">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {dimensionCards.map(dim => (
            <div key={dim.label} className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[18px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#FAF3E1]">{dim.label}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`w-2.5 h-2.5 rounded-full ${
                          star <= dim.data.score
                            ? dim.data.score >= 4
                              ? 'bg-[#B8D88A]'
                              : dim.data.score >= 3
                              ? 'bg-[#F7C65B]'
                              : 'bg-[#ED6A5A]'
                            : 'bg-[#101416]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#FAF3E1] ml-1">
                    {dim.data.score}/5
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#96928A]">{dim.data.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Areas For Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Identified Strengths */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#B8D88A] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B8D88A]" />
            What Was Strong
          </h3>
          <div className="space-y-3">
            {latestEvaluation.strengths.map((str, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#FAF3E1]">
                <span className="text-[#B8D88A] mt-0.5">•</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Weaknesses */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#ED6A5A] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ED6A5A]" />
            Areas For Improvement
          </h3>
          <div className="space-y-3">
            {latestEvaluation.weaknesses.map((wk, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#FAF3E1]">
                <span className="text-[#ED6A5A] mt-0.5">•</span>
                <span>{wk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What Was Missing From Explanation */}
      {latestEvaluation.keyMissingElements.length > 0 && (
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 mb-8">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#F7C65B] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F7C65B]" />
            What Was Missing From Your Explanation
          </h3>
          <div className="space-y-2">
            {latestEvaluation.keyMissingElements.map((elem, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#FAF3E1]">
                <span className="text-[#F7C65B] font-mono">[{idx + 1}]</span>
                <span>{elem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(250,243,225,0.12)]">
        <button
          onClick={() => setCurrentStep('interview')}
          className="text-xs text-[#96928A] hover:text-[#FAF3E1] font-medium cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Another Question</span>
        </button>

        <button
          onClick={() => setCurrentStep('path')}
          className="w-full sm:w-auto px-8 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer font-display shadow-lg shadow-[#FF6D1F]/20"
        >
          <span>RETURN TO ADAPTED ROADMAP →</span>
        </button>
      </div>
    </div>
  );
};
