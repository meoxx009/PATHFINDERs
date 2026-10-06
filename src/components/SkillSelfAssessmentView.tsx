import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  Award, 
  Info 
} from 'lucide-react';

interface SkillItem {
  id: string;
  name: string;
  category: 'core' | 'frameworks' | 'tools' | 'systems';
  desc: string;
}

const DEFAULT_ASSESSMENT_SKILLS: SkillItem[] = [
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'core', desc: 'Arrays, trees, graphs, sorting, time complexity Big-O' },
  { id: 'lang_core', name: 'Core Language Fundamentals', category: 'core', desc: 'Syntax, memory, types, asynchronous execution' },
  { id: 'web_standards', name: 'Web / Protocol Standards', category: 'core', desc: 'HTTP/HTTPS, REST, CORS, JSON serialization' },
  { id: 'framework_eng', name: 'Modern Framework Architecture', category: 'frameworks', desc: 'Component lifecycle, state management, modularization' },
  { id: 'database_sql', name: 'Database Design & Queries', category: 'frameworks', desc: 'Relational schemas, SQL queries, indexing, ORM' },
  { id: 'version_control', name: 'Git & Collaboration Workflow', category: 'tools', desc: 'Branching, PRs, merge conflicts, Git CLI conventions' },
  { id: 'debugging_testing', name: 'Testing & Debugging Rigor', category: 'tools', desc: 'Unit testing, browser devtools, logs inspection' },
  { id: 'ci_deployment', name: 'Build Systems & Cloud Deployment', category: 'systems', desc: 'Vite/Webpack, Docker, Vercel/AWS deployment pipelines' },
  { id: 'system_design', name: 'Scalability & System Design', category: 'systems', desc: 'Caching, microservices vs monolith, performance optimization' },
];

const LEVEL_LABELS = [
  { level: 1, name: 'Novice', desc: 'Theoretical awareness only' },
  { level: 2, name: 'Academic', desc: 'Classroom or tutorial projects' },
  { level: 3, name: 'Working', desc: 'Able to build standalone projects' },
  { level: 4, name: 'Proficient', desc: 'Industry-standard practices' },
  { level: 5, name: 'Production', desc: 'High-scale production ready' },
];

export const SkillSelfAssessmentView: React.FC = () => {
  const { profile, setProfile, setCurrentStep, gapAnalysis } = useShift();

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    return profile.selfAssessment || {
      dsa: 3,
      lang_core: 3,
      web_standards: 2,
      framework_eng: 3,
      database_sql: 2,
      version_control: 3,
      debugging_testing: 2,
      ci_deployment: 2,
      system_design: 1,
    };
  });

  const handleRate = (skillId: string, level: number) => {
    const updated = { ...ratings, [skillId]: level };
    setRatings(updated);
    setProfile(prev => ({
      ...prev,
      selfAssessment: updated,
    }));
  };

  // Calculate scores
  const scoreValues = Object.values(ratings);
  const totalScore = scoreValues.reduce((a, b) => a + b, 0);
  const maxPossible = DEFAULT_ASSESSMENT_SKILLS.length * 5;
  const percentage = Math.round((totalScore / maxPossible) * 100);

  const coreAverage = ((ratings.dsa + ratings.lang_core + ratings.web_standards) / 15 * 100).toFixed(0);
  const frameworkAverage = ((ratings.framework_eng + ratings.database_sql) / 10 * 100).toFixed(0);
  const toolingAverage = ((ratings.version_control + ratings.debugging_testing) / 10 * 100).toFixed(0);
  const systemsAverage = ((ratings.ci_deployment + ratings.system_design) / 10 * 100).toFixed(0);

  return (
    <div className="py-10 px-6 sm:px-10 max-w-[1280px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[rgba(250,243,225,0.1)] mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6D1F]/10 border border-[#FF6D1F]/30 text-[#FF6D1F] text-xs font-mono font-medium tracking-wider uppercase mb-3">
            <Cpu className="w-3.5 h-3.5" />
            Engineering Competency Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#FAF3E1]">
            Skill Self-Assessment
          </h1>
          <p className="text-[#FAF3E1]/70 text-sm sm:text-base mt-2 max-w-2xl font-sans">
            Calibrate your current engineering proficiency across core pillars. SkillForge AI maps these self-evaluations against verifiable resume evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep('setup')}
            className="px-5 py-2.5 rounded-xl border border-[rgba(250,243,225,0.15)] bg-[#222222]/40 hover:bg-[#222222] text-[#FAF3E1] text-xs font-mono font-semibold transition"
          >
            EDIT TARGET ROLE
          </button>
          <button
            onClick={() => setCurrentStep(gapAnalysis ? 'gap' : 'setup')}
            className="px-5 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider transition flex items-center gap-2"
          >
            {gapAnalysis ? 'VIEW SKILL GAP →' : 'EVALUATE RESUME →'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Ratings Left, Readiness Scorecard Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Competency Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-[#FAF3E1] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF6D1F]" />
              Engineering Competency Domains
            </h2>
            <span className="text-xs font-mono text-[#FAF3E1]/50">
              Ratings: 1 (Novice) to 5 (Production Ready)
            </span>
          </div>

          <div className="space-y-4">
            {DEFAULT_ASSESSMENT_SKILLS.map((skill) => {
              const currentLevel = ratings[skill.id] || 1;
              return (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.1)] hover:border-[rgba(250,243,225,0.2)] transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-[#FAF3E1] font-display">
                          {skill.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#222222] text-[#FAF3E1]/60">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#FAF3E1]/60 mt-0.5 font-sans">
                        {skill.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                      {[1, 2, 3, 4, 5].map((lvl) => {
                        const isSelected = currentLevel === lvl;
                        const isBelow = currentLevel >= lvl;
                        return (
                          <button
                            key={lvl}
                            onClick={() => handleRate(skill.id, lvl)}
                            title={LEVEL_LABELS[lvl - 1].desc}
                            className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#FF6D1F] text-[#FAF3E1] shadow-lg shadow-[#FF6D1F]/30 scale-105'
                                : isBelow
                                ? 'bg-[#222222] text-[#FF6D1F] border border-[#FF6D1F]/30'
                                : 'bg-[#222222]/40 text-[#FAF3E1]/40 border border-transparent hover:border-[rgba(250,243,225,0.1)]'
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Level explanation */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#FAF3E1]/40 pt-2 border-t border-[rgba(250,243,225,0.06)]">
                    <span>Current: <strong className="text-[#FF6D1F]">{LEVEL_LABELS[currentLevel - 1].name}</strong></span>
                    <span>{LEVEL_LABELS[currentLevel - 1].desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Readiness Score & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)] sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(250,243,225,0.08)] mb-6">
              <span className="text-xs font-mono text-[#FAF3E1]/60 uppercase tracking-wider">
                Engineering Index
              </span>
              <Award className="w-4 h-4 text-[#FF6D1F]" />
            </div>

            {/* Circular / Large percentage display */}
            <div className="text-center py-4">
              <div className="text-6xl font-black font-display text-[#FAF3E1] tracking-tight">
                {percentage}%
              </div>
              <div className="text-xs font-mono text-[#FF6D1F] mt-1 font-semibold uppercase tracking-wider">
                Self-Assessed Proficiency
              </div>
              <p className="text-xs text-[#FAF3E1]/60 mt-3 font-sans">
                Target Role: <strong className="text-[#FAF3E1]">{profile.targetRoleTitle || 'Software Engineer'}</strong>
              </p>
            </div>

            {/* Domain Breakdown Bars */}
            <div className="space-y-4 pt-4 border-t border-[rgba(250,243,225,0.08)]">
              <div>
                <div className="flex justify-between text-xs font-mono text-[#FAF3E1]/80 mb-1">
                  <span>Core Foundations</span>
                  <span>{coreAverage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#222222]">
                  <div className="h-full rounded-full bg-[#FF6D1F]" style={{ width: `${coreAverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#FAF3E1]/80 mb-1">
                  <span>Architecture & DB</span>
                  <span>{frameworkAverage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#222222]">
                  <div className="h-full rounded-full bg-[#FAF3E1]" style={{ width: `${frameworkAverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#FAF3E1]/80 mb-1">
                  <span>Tools & Testing</span>
                  <span>{toolingAverage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#222222]">
                  <div className="h-full rounded-full bg-[#F5E7C6]" style={{ width: `${toolingAverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#FAF3E1]/80 mb-1">
                  <span>Systems & DevOps</span>
                  <span>{systemsAverage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#222222]">
                  <div className="h-full rounded-full bg-[#FF6D1F]/70" style={{ width: `${systemsAverage}%` }} />
                </div>
              </div>
            </div>

            {/* Evidence Insight Note */}
            <div className="mt-6 p-4 rounded-xl bg-[#222222]/50 border border-[rgba(250,243,225,0.08)] text-xs text-[#FAF3E1]/70 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#FF6D1F] shrink-0 mt-0.5" />
              <span>
                Industry recruiters prioritize verifiable project proof over self-ratings. Next, analyze your resume to produce evidence-backed gap reports.
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 space-y-2.5">
              <button
                onClick={() => setCurrentStep('setup')}
                className="w-full py-3 px-4 rounded-xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D1F]/20"
              >
                <span>VERIFY WITH RESUME EVIDENCE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {gapAnalysis && (
                <button
                  onClick={() => setCurrentStep('gap')}
                  className="w-full py-2.5 px-4 rounded-xl border border-[rgba(250,243,225,0.15)] bg-transparent hover:bg-[#222222]/40 text-[#FAF3E1] text-xs font-mono font-semibold transition"
                >
                  VIEW CALCULATED SKILL GAPS
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
