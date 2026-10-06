import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  Send, 
  Sparkles, 
  Layers, 
  FileText, 
  ShieldAlert, 
  Zap, 
  Info 
} from 'lucide-react';

export const InterviewCoachView: React.FC = () => {
  const { 
    interviewQuestions, 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    submitInterviewAnswer, 
    isEvaluating, 
    profile, 
    setCurrentStep,
    loadDemoScenario 
  } = useShift();

  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const question = interviewQuestions[currentQuestionIndex];

  if (!question) {
    return (
      <div className="max-w-[1280px] mx-auto py-16 px-6 text-center">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-10 max-w-lg mx-auto shadow-2xl">
          <Sparkles className="w-12 h-12 text-[#FF6D1F] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
            No Interview Questions Active
          </h2>
          <p className="text-xs text-[#96928A] mt-2 mb-6 leading-relaxed">
            Generate your resume analysis and target-role skill gap benchmark first to create questions tailored to your profile.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setCurrentStep('setup')}
              className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer shadow-lg shadow-[#FF6D1F]/20"
            >
              START CAREER SETUP →
            </button>
            <button
              onClick={() => {
                loadDemoScenario('prd_frontend_beginner');
                setCurrentStep('interview');
              }}
              className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer font-display transition"
            >
              <Zap className="w-4 h-4 text-[#FF6D1F]" />
              <span>Explore an example profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const wordCount = typedAnswer.trim().split(/\s+/).filter(Boolean).length;

  const handleFillSample = (type: 'weak' | 'strong') => {
    if (question.sampleAnswers) {
      setTypedAnswer(question.sampleAnswers[type].text);
      setErrorNotice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim() || typedAnswer.trim().length < 20) {
      setErrorNotice('Please type an answer to the interview question (at least 20 characters), or click a sample preset above.');
      return;
    }
    setErrorNotice(null);
    await submitInterviewAnswer(typedAnswer);
  };

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(250,243,225,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
              Interview Coach
            </span>
            <span className="text-[#96928A]">•</span>
            <span className="text-xs text-[#96928A]">Technical Architecture Simulation</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
            Targeted Technical Interview Practice
          </h1>
          <p className="text-sm text-[#96928A] mt-2">
            Evaluates your verbal clarity, architectural depth, and technical precision for <strong className="text-[#FAF3E1]">{profile.targetRoleTitle}</strong>.
          </p>
        </div>

        {interviewQuestions.length > 1 && (
          <div className="flex items-center gap-1.5 self-start sm:self-center bg-[#101416] border border-[rgba(250,243,225,0.14)] p-1.5 rounded-full">
            {interviewQuestions.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setTypedAnswer('');
                }}
                className={`px-3.5 py-1 text-xs rounded-full font-mono transition cursor-pointer ${
                  currentQuestionIndex === idx
                    ? 'bg-[#FF6D1F] text-[#222222] font-bold'
                    : 'text-[#96928A] hover:text-[#FAF3E1]'
                }`}
              >
                Q0{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The Question Card */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-8 sm:p-10 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6D1F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tested Skills Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#96928A] flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#FF6D1F]" />
            Tested Skills:
          </span>
          {question.testedSkills.map(s => (
            <span
              key={s}
              className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#080B0D] text-[#FAF3E1] border border-[rgba(250,243,225,0.14)]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Question Prompt */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#FAF3E1] leading-snug mb-5">
          "{question.question}"
        </h2>

        {/* Context Rationale */}
        <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[18px] p-4 flex items-start gap-3 text-xs text-[#96928A]">
          <Info className="w-4 h-4 text-[#FF6D1F] flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{question.contextRationale}</span>
        </div>
      </div>

      {/* Demo Sample Answers Insertor */}
      {question.sampleAnswers && (
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 mb-6">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FAF3E1]">
              <Zap className="w-4 h-4 text-[#FF6D1F]" />
              <span>Evaluation Presets: Test The Adaptive Loop</span>
            </div>
            <span className="text-[10px] text-[#96928A] font-mono uppercase tracking-wider">1-Click Insert</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Weak Answer */}
            <button
              type="button"
              onClick={() => handleFillSample('weak')}
              className="p-4 rounded-[20px] border text-left transition cursor-pointer bg-[#080B0D] border-[#ED6A5A]/30 hover:border-[#ED6A5A] group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#ED6A5A] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Weak Answer (PRD §9 Trigger)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ED6A5A]/20 text-[#ED6A5A]">
                  Adaptive Demo
                </span>
              </div>
              <p className="text-xs text-[#96928A] line-clamp-2">
                "{question.sampleAnswers.weak.text}"
              </p>
            </button>

            {/* Strong Answer */}
            <button
              type="button"
              onClick={() => handleFillSample('strong')}
              className="p-4 rounded-[20px] border text-left transition cursor-pointer bg-[#080B0D] border-[#B8D88A]/30 hover:border-[#B8D88A] group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#B8D88A] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Strong Technical Answer
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B8D88A]/20 text-[#B8D88A]">
                  STAR Method
                </span>
              </div>
              <p className="text-xs text-[#96928A] line-clamp-2">
                "{question.sampleAnswers.strong.text}"
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Answer Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 sm:p-7">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-[#FAF3E1] font-bold uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF6D1F]" />
              Your Typed Response (Text-Only MVP)
            </span>
            <span className="font-mono text-[#96928A]">
              Word count: <strong className="text-[#FAF3E1]">{wordCount}</strong> / 120-250 recommended
            </span>
          </div>

          <textarea
            rows={7}
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder="Type your response as if speaking to a hiring manager or senior engineer... (or select a sample answer above)"
            className="w-full bg-[#080B0D] border border-[rgba(250,243,225,0.14)] rounded-[20px] p-5 text-sm text-[#FAF3E1] placeholder:text-[#96928A]/50 focus:outline-none focus:border-[#FF6D1F] transition leading-relaxed resize-y font-mono"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-[#96928A]">
            <span>Evaluates relevance, structure, specificity, evidence, and technical clarity (Rule #8).</span>
            {wordCount > 0 && (
              <span className={wordCount < 40 ? 'text-[#F7C65B]' : 'text-[#B8D88A]'}>
                {wordCount < 40 ? 'Brief response' : 'Good detail depth'}
              </span>
            )}
          </div>
        </div>

        {errorNotice && (
          <div className="bg-[#ED6A5A]/15 border border-[#ED6A5A]/50 rounded-[20px] p-4 text-xs text-[#ED6A5A]">
            {errorNotice}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => setCurrentStep('path')}
            className="text-xs text-[#96928A] hover:text-[#FAF3E1] font-medium cursor-pointer"
          >
            ← Back to Learning Path
          </button>

          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full sm:w-auto px-10 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider shadow-xl shadow-[#FF6D1F]/25 transition flex items-center justify-center gap-2 cursor-pointer font-display disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <span className="w-4 h-4 border-2 border-[#222222]/30 border-t-[#222222] rounded-full animate-spin" />
                <span>EVALUATING ACROSS 5 DIMENSIONS...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SUBMIT RESPONSE & RECEIVE EVALUATION →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
