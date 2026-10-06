import React from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  Target, 
  AlertTriangle, 
  Award,
  Play
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    profile, 
    extractedResume, 
    gapAnalysis, 
    learningTasks, 
    latestEvaluation, 
    setCurrentStep,
    loadDemoScenario 
  } = useShift();

  if (!extractedResume || !gapAnalysis) {
    return (
      <div className="max-w-[1280px] mx-auto py-16 px-6 text-center">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-10 max-w-lg mx-auto">
          <Award className="w-10 h-10 text-[#FF6D1F] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
            No Active Engineering Roadmap
          </h2>
          <p className="text-xs text-[#96928A] mt-2 mb-6">
            Configure your engineering branch, target role, and resume to generate your personalized career dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setCurrentStep('roles')}
              className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display"
            >
              EXPLORE ENGINEERING ROLES →
            </button>
            <button
              onClick={() => setCurrentStep('setup')}
              className="w-full py-3 rounded-[20px] bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-semibold"
            >
              CUSTOMIZE TARGET ROLE & RESUME
            </button>
            <button
              onClick={() => loadDemoScenario('prd_frontend_beginner')}
              className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.14)] text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Explore an example profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = learningTasks.filter(t => t.completed).length;
  const progressPercent = learningTasks.length > 0 ? Math.round((completedCount / learningTasks.length) * 100) : 0;
  const nextTask = learningTasks.find(t => !t.completed) || learningTasks[0];
  const topThreeGaps = gapAnalysis.highPriorityGaps.slice(0, 3);

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(250,243,225,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
              Dashboard / Overview
            </span>
            <span className="text-[#96928A]">•</span>
            <span className="text-xs text-[#96928A]">Active Session</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
            Engineering Career Dashboard
          </h1>
          <p className="text-sm text-[#96928A] mt-2">
            Target Role: <strong className="text-[#FAF3E1]">{profile.targetRoleTitle}</strong> ({profile.experienceLevel}) • {profile.weeklyHours} hrs/week
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={() => setCurrentStep('roles')}
            className="px-5 py-3.5 rounded-[22px] bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer font-display"
          >
            <span>EXPLORE ROLES</span>
          </button>

          <button
            onClick={() => setCurrentStep('path')}
            className="px-6 py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer font-display shadow-lg shadow-[#FF6D1F]/20"
          >
            <span>OPEN MY ROADMAP →</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        {/* Coverage Benchmark */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#96928A]">Benchmark Alignment</span>
          <div className="font-display text-4xl font-black text-[#FAF3E1] mt-2">
            {gapAnalysis.overallReadinessScore}%
          </div>
          <p className="text-[11px] text-[#96928A] mt-1.5">Target taxonomy coverage</p>
        </div>

        {/* Evidence Found */}
        <div className="bg-[#101416] border border-[#B8D88A]/30 rounded-[26px] p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8D88A]">Evidence Found</span>
          <div className="font-display text-4xl font-black text-[#B8D88A] mt-2">
            {gapAnalysis.demonstrated.length}
          </div>
          <p className="text-[11px] text-[#96928A] mt-1.5">Verified project skills</p>
        </div>

        {/* Priority Gaps */}
        <div className="bg-[#101416] border border-[#ED6A5A]/30 rounded-[26px] p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ED6A5A]">Priority Gaps</span>
          <div className="font-display text-4xl font-black text-[#ED6A5A] mt-2">
            {gapAnalysis.highPriorityGaps.length}
          </div>
          <p className="text-[11px] text-[#96928A] mt-1.5">Critical screening gaps</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-[#101416] border border-[#F7C65B]/30 rounded-[26px] p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F7C65B]">Sprint Progress</span>
          <div className="font-display text-4xl font-black text-[#FAF3E1] mt-2">
            {completedCount}/{learningTasks.length}
          </div>
          <div className="w-full bg-[rgba(250,243,225,0.14)] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-[#FF6D1F] h-full rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Grid: Next Recommended Task & Top Three Skill Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Next Recommended Task Card */}
        {nextTask && (
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(250,243,225,0.1)]">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[#FF6D1F] flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Next Recommended Task
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold">
                Day {nextTask.dayNumber}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mb-2">
              {nextTask.title}
            </h3>
            <p className="text-xs text-[#96928A] leading-relaxed mb-4">
              {nextTask.reasonItMatters}
            </p>

            <div className="bg-[#080B0D] p-4 rounded-[18px] border border-[rgba(250,243,225,0.1)] text-xs mb-5 space-y-1.5">
              <div className="text-[#FAF3E1] font-semibold">Deliverable:</div>
              <div className="text-[#96928A] font-mono text-[11px]">{nextTask.expectedOutcome}</div>
            </div>

            <button
              onClick={() => setCurrentStep('path')}
              className="w-full py-3 rounded-[20px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer"
            >
              OPEN TASK IN SPRINT →
            </button>
          </div>
        )}

        {/* Top 3 Skill Gaps Card */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(250,243,225,0.1)]">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#ED6A5A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Top Priority Skill Gaps
            </span>
            <span className="text-[10px] text-[#96928A] font-mono">Taxonomy Screening</span>
          </div>

          <div className="space-y-3 mb-5">
            {topThreeGaps.map((gap, idx) => (
              <div key={idx} className="bg-[#080B0D] p-4 rounded-[18px] border border-[rgba(250,243,225,0.1)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#FAF3E1]">{gap.skill}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#ED6A5A]/15 text-[#ED6A5A]">
                    {gap.importance} Priority
                  </span>
                </div>
                <p className="text-[11px] text-[#96928A] line-clamp-2">{gap.explanation}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep('gap')}
            className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer"
          >
            VIEW FULL GAP BENCHMARK →
          </button>
        </div>
      </div>

      {/* Interview Coach Status & Quick Launch */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[#FF6D1F]">
            Targeted Interview Practice
          </span>
          <h3 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-0.5">
            {latestEvaluation ? `Latest Evaluation: ${latestEvaluation.overallScore}/5.0` : 'Ready For Technical Simulation'}
          </h3>
          <p className="text-xs text-[#96928A] mt-1">
            Simulate a project walkthrough question testing component hierarchy, state flow, and STAR structure.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep('interview')}
          className="px-8 py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer whitespace-nowrap shadow-lg shadow-[#FF6D1F]/20"
        >
          {latestEvaluation ? 'RE-TEST INTERVIEW →' : 'START INTERVIEW →'}
        </button>
      </div>
    </div>
  );
};
