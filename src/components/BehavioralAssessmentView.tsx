import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useShift } from '../context/ShiftContext';
import { BEHAVIORAL_SCENARIOS } from '../data/behavioralBank';
import type { BehavioralResult } from '../types';

export const BehavioralAssessmentView: React.FC = () => {
  const {
    setCurrentStep,
    setBehavioralAssessmentResult,
    behavioralAssessmentResult
  } = useShift();

  const scenarios = BEHAVIORAL_SCENARIOS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<BehavioralResult | null>(behavioralAssessmentResult);

  const currentScenario = scenarios[currentIndex];
  const selectedOptionId = selectedOptions[currentScenario?.id];

  const handleSelect = (optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentScenario.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = () => {
    const breakdown: BehavioralResult['competencyBreakdown'] = {};
    const actions: string[] = [];
    let strongCount = 0;

    scenarios.forEach(sc => {
      const chosenId = selectedOptions[sc.id];
      const chosenOpt = sc.options.find(o => o.id === chosenId) || sc.options[0];

      if (chosenOpt.behaviorPattern === 'Strong evidence') {
        strongCount++;
      } else {
        actions.push(`Practice: ${sc.title} — focus on proactive data-driven mitigation.`);
      }

      breakdown[sc.competencyEvaluated] = {
        pattern: chosenOpt.behaviorPattern,
        explanation: chosenOpt.tradeoffExplanation,
        developmentAction: chosenOpt.behaviorPattern === 'Strong evidence'
          ? 'Maintain transparent engineering communication.'
          : 'Anchor proposals in concrete telemetry and business impact.'
      };
    });

    const overallPattern = strongCount === scenarios.length
      ? 'Strong evidence'
      : strongCount >= 1
      ? 'Consistent behavior'
      : 'Developing behavior';

    const result: BehavioralResult = {
      overallPattern,
      competencyBreakdown: breakdown,
      recommendedDevelopmentActions: actions.length > 0 ? actions : ['Continue building high-ownership engineering habits.'],
      completedAt: new Date().toISOString()
    };

    setFinalResult(result);
    setBehavioralAssessmentResult(result);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setSelectedOptions({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep('roles')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF3E1]/70 hover:text-[#FAF3E1] bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roles</span>
        </button>

        <div className="text-xs font-medium text-[#FAF3E1]/60">
          Workplace Scenario Assessment
        </div>
      </div>

      {!isCompleted ? (
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-[#FAF3E1]/60">
              <span>Scenario {currentIndex + 1} of {scenarios.length}</span>
              <span className="font-semibold text-blue-400 capitalize">
                Focus: {currentScenario.competencyEvaluated.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="w-full bg-[#080B0D] h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Context & Scenario Title */}
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-[#FAF3E1]/70">
              {currentScenario.engineeringContext}
            </span>
            <h3 className="text-xl font-bold text-[#FAF3E1]">
              {currentScenario.title}
            </h3>
            <p className="text-xs text-[#FAF3E1]/80 leading-relaxed pt-1">
              {currentScenario.scenario}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-semibold text-[#FAF3E1]/50 uppercase tracking-wider">
              How would you respond in this engineering situation?
            </div>
            {currentScenario.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 text-xs leading-relaxed ${
                    isSelected
                      ? 'bg-blue-500/15 border-blue-500 text-[#FAF3E1]'
                      : 'bg-[#080B0D] border-white/10 text-[#FAF3E1]/80 hover:border-white/30'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-blue-400 bg-blue-500/30' : 'border-white/30'
                  }`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                  </span>
                  <span className="flex-1">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end pt-4 border-t border-white/5">
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <span>{currentIndex === scenarios.length - 1 ? 'Evaluate Scenarios' : 'Next Scenario'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#FAF3E1]">
              Workplace Engineering Behavioral Profile
            </h2>
            <p className="text-xs text-[#FAF3E1]/60">
              Assessed across ownership, peer technical communication, and pragmatic trade-off reasoning.
            </p>
          </div>

          <div className="p-4 bg-[#080B0D] rounded-xl border border-white/5 text-left space-y-2">
            <div className="text-[11px] text-[#FAF3E1]/50 uppercase tracking-wider">
              Overall Behavioral Pattern
            </div>
            <div className="text-lg font-extrabold text-blue-400">
              {finalResult?.overallPattern}
            </div>
            <p className="text-xs text-[#FAF3E1]/70 leading-relaxed">
              Your decision patterns prioritize system uptime, empirical evidence, and constructive peer alignment during technical ambiguity.
            </p>
          </div>

          {/* Competency breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
            {finalResult?.competencyBreakdown && Object.entries(finalResult.competencyBreakdown).map(([comp, data]) => (
              <div key={comp} className="bg-[#080B0D] p-4 rounded-xl border border-white/5 space-y-2">
                <span className="text-[11px] text-[#FAF3E1]/50 uppercase tracking-wider block capitalize">
                  {comp.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-bold text-emerald-400 block">
                  {data.pattern}
                </span>
                <p className="text-[11px] text-[#FAF3E1]/70 leading-relaxed">
                  {data.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FAF3E1] transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Scenarios</span>
            </button>

            <button
              onClick={() => setCurrentStep('interview')}
              className="px-6 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] text-xs font-bold text-white transition flex items-center gap-2 shadow-lg shadow-[#FF6D1F]/20"
            >
              <span>Practice Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
