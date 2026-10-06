import React from 'react';
import { useShift } from '../context/ShiftContext';
import { Timer, CheckSquare, Target, Sparkles, MessageSquare, Zap, Layers } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  const { metrics, learningTasks } = useShift();
  const completedTasks = learningTasks.filter(t => t.completed).length;
  const totalTasks = learningTasks.length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (metrics.generatedTasksCount === 0 && metrics.extractedSkillCount === 0) {
    return null;
  }

  return (
    <div className="bg-[#101416] border-b border-[rgba(250,243,225,0.12)] py-2.5 px-6 sm:px-10">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-y-2 text-xs">
        <div className="flex items-center gap-2 text-[#96928A] font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6D1F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6D1F]"></span>
          </span>
          <span className="text-[#FAF3E1] font-bold tracking-widest uppercase text-[10px] font-mono">Workspace Metrics:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#FAF3E1] font-mono text-[11px]">
          {/* Analysis Time */}
          <div className="flex items-center gap-1.5" title="Execution latency of resume evidence and taxonomy matching">
            <Timer className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span className="text-[#96928A]">Latency:</span>
            <span className="font-semibold text-[#FAF3E1]">{metrics.analysisResponseTimeMs}ms</span>
          </div>

          {/* Extracted Skills */}
          <div className="flex items-center gap-1.5" title="Number of verifiable technical skills found">
            <Sparkles className="w-3.5 h-3.5 text-[#B8D88A]" />
            <span className="text-[#96928A]">Skills:</span>
            <span className="font-semibold text-[#B8D88A]">{metrics.extractedSkillCount}</span>
          </div>

          {/* Actionable Gaps */}
          <div className="flex items-center gap-1.5" title="High-priority competency gaps against target role taxonomy">
            <Target className="w-3.5 h-3.5 text-[#ED6A5A]" />
            <span className="text-[#96928A]">Role Gaps:</span>
            <span className="font-semibold text-[#ED6A5A]">{metrics.actionableGapsCount}</span>
          </div>

          {/* Generated Tasks */}
          <div className="flex items-center gap-1.5" title="Sprint tasks sized to weekly hours">
            <Layers className="w-3.5 h-3.5 text-[#F7C65B]" />
            <span className="text-[#96928A]">Tasks:</span>
            <span className="font-semibold text-[#F7C65B]">{metrics.generatedTasksCount}</span>
          </div>

          {/* Tasks Completed */}
          <div className="flex items-center gap-1.5" title="User task checklist completion state">
            <CheckSquare className="w-3.5 h-3.5 text-[#B8D88A]" />
            <span className="text-[#96928A]">Progress:</span>
            <span className="font-semibold text-[#B8D88A]">
              {completedTasks}/{totalTasks} ({completionPct}%)
            </span>
          </div>

          {/* Interview Sessions */}
          <div className="flex items-center gap-1.5" title="Interview practice answers evaluated">
            <MessageSquare className="w-3.5 h-3.5 text-[#FAF3E1]" />
            <span className="text-[#96928A]">Interview:</span>
            <span className="font-semibold text-[#FAF3E1]">{metrics.interviewSessionsCompleted}</span>
          </div>

          {/* Adaptive Updates */}
          <div className="flex items-center gap-1.5" title="Dynamic path re-prioritizations triggered by interview performance">
            <Zap className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span className="text-[#96928A]">Adaptive Shifts:</span>
            <span className={`font-semibold ${metrics.adaptiveUpdatesCount > 0 ? 'text-[#FF6D1F] font-bold' : 'text-[#96928A]'}`}>
              {metrics.adaptiveUpdatesCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
