import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Compass,
  Briefcase,
  Layers,
  ArrowRight,
  HelpCircle,
  FolderGit2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useShift } from '../context/ShiftContext';
import { getRoleById, isBranchAligned, type CareerRole } from '../data/roles';

const CATEGORY_TITLES: Record<string, string> = {
  foundations: 'Engineering Foundations & Theory',
  core_technical: 'Core Technical Competencies',
  tools: 'Industry Tooling & Workflow',
  domain_skills: 'Domain Knowledge & Standards',
  testing_validation: 'Testing, Quality & Verification',
  communication: 'Communication & Engineering Rigor',
  project_execution: 'Production Execution & Delivery'
};

export const RoleDetailView: React.FC = () => {
  const {
    selectedRole,
    setSelectedRole,
    profile,
    setCurrentStep,
    changeTargetRole,
    bookmarkedRoleIds,
    toggleBookmarkRole
  } = useShift();

  const [activeTab, setActiveTab] = useState<'skills' | 'projects' | 'interview' | 'adjacent'>('skills');

  // Fallback to profile targetRole if selectedRole is null
  const role: CareerRole = selectedRole || getRoleById(profile.targetRole);
  const isBookmarked = bookmarkedRoleIds.includes(role.id);
  const branchAligned = isBranchAligned(role, profile.engineeringBranch);

  const handleStartRoadmap = () => {
    changeTargetRole(role.id, role.title);
    setCurrentStep('path');
  };

  const handleStartTechnicalAssessment = () => {
    changeTargetRole(role.id, role.title);
    setCurrentStep('technical-assessment');
  };

  const handleStartBehavioralAssessment = () => {
    changeTargetRole(role.id, role.title);
    setCurrentStep('behavioral-assessment');
  };

  // Group skills by category
  const skillsByCategory = role.requiredSkills.reduce((acc, skill) => {
    const cat = skill.category || 'core_technical';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof role.requiredSkills>);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep('roles')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF3E1]/70 hover:text-[#FAF3E1] transition bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Roles</span>
        </button>

        <button
          onClick={() => toggleBookmarkRole(role.id)}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition ${
            isBookmarked
              ? 'bg-[#FF6D1F]/20 border-[#FF6D1F] text-[#FF6D1F]'
              : 'bg-white/5 border-white/10 text-[#FAF3E1]/70 hover:text-[#FAF3E1]'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Role'}</span>
        </button>
      </div>

      {/* Role Header Banner */}
      <div className="bg-[#222222] border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FF6D1F]/20 text-[#FF6D1F] border border-[#FF6D1F]/30">
                {role.domain.replace(/_/g, ' ')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-[#FAF3E1]/70">
                {role.estimatedWeeks.beginner} Weeks Estimated
              </span>
              {role.beginnerFriendly && (
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Beginner Friendly
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FAF3E1] tracking-tight">
              {role.title}
            </h1>

            <p className="text-base text-[#FAF3E1]/80 leading-relaxed">
              {role.description}
            </p>
          </div>

          {/* Action Callouts */}
          <div className="flex flex-col gap-2.5 shrink-0 min-w-[220px]">
            <button
              onClick={handleStartRoadmap}
              className="w-full py-3 px-5 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D1F]/25"
            >
              <span>Build My Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartTechnicalAssessment}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#FAF3E1] font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Technical Assessment</span>
            </button>

            <button
              onClick={handleStartBehavioralAssessment}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#FAF3E1] font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span>Behavioral Scenarios</span>
            </button>
          </div>
        </div>

        {/* Cross-Branch Guidance Callout */}
        {!branchAligned && profile.engineeringBranch ? (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold block mb-0.5">
                Open Access Notice for {profile.engineeringBranch} Students
              </strong>
              This role is fully open to students from your academic discipline. SkillForge AI customizes your roadmap with foundational prerequisite units to ensure seamless transition into this career.
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2.5 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Directly aligns with your engineering stream and academic coursework.</span>
          </div>
        )}

        {/* Meta badges: Tools & Industries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs">
          <div>
            <span className="text-[#FAF3E1]/50 font-semibold uppercase tracking-wider block mb-2">
              Primary Tooling & Frameworks
            </span>
            <div className="flex flex-wrap gap-1.5">
              {role.tools.map(tool => (
                <span key={tool} className="px-2.5 py-1 bg-[#080B0D] border border-white/10 rounded-lg text-[#FAF3E1]/80">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[#FAF3E1]/50 font-semibold uppercase tracking-wider block mb-2">
              Target Industries
            </span>
            <div className="flex flex-wrap gap-1.5">
              {role.industries.map(ind => (
                <span key={ind} className="px-2.5 py-1 bg-[#080B0D] border border-white/10 rounded-lg text-[#FAF3E1]/80">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Competency Matrix ({role.requiredSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Verified Project Benchmarks</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'interview'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interview Assessment Focus</span>
        </button>

        {role.adjacentRoles && role.adjacentRoles.length > 0 && (
          <button
            onClick={() => setActiveTab('adjacent')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'adjacent'
                ? 'border-[#FF6D1F] text-[#FF6D1F]'
                : 'border-transparent text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Adjacent Career Roles</span>
          </button>
        )}
      </div>

      {/* Tab 1: Skills Breakdown */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="bg-[#222222] border border-white/10 rounded-2xl p-6 space-y-4 shadow-md">
              <h3 className="text-base font-bold text-[#FAF3E1] flex items-center gap-2 border-b border-white/5 pb-3">
                <span className="w-2 h-2 rounded-full bg-[#FF6D1F]" />
                <span>{CATEGORY_TITLES[category] || category.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="text-xs text-[#FAF3E1]/40 font-normal">({skills.length} competencies)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map(skill => (
                  <div
                    key={skill.skillId}
                    className="bg-[#080B0D] border border-white/5 rounded-xl p-4 space-y-2 hover:border-white/20 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#FAF3E1]">
                        {skill.skillName}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        skill.importance === 'critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : skill.importance === 'high'
                          ? 'bg-[#FF6D1F]/10 text-[#FF6D1F] border border-[#FF6D1F]/20'
                          : 'bg-white/5 text-[#FAF3E1]/60'
                      }`}>
                        Level {skill.requiredLevel} • {skill.importance}
                      </span>
                    </div>

                    <p className="text-xs text-[#FAF3E1]/70 leading-relaxed">
                      {skill.benchmarkDescription}
                    </p>

                    {skill.suggestedPractice && (
                      <div className="text-[11px] text-[#FAF3E1]/60 pt-2 border-t border-white/5">
                        <strong className="text-[#FF6D1F] font-semibold">Recommended Practice:</strong> {skill.suggestedPractice}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Projects */}
      {activeTab === 'projects' && (
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#FAF3E1]">
              Industry-Grade Portfolio Deliverables
            </h3>
            <p className="text-xs text-[#FAF3E1]/60">
              Recruiters and engineering hiring managers look for verifiable technical artifacts. Building these projects demonstrates your practical execution ability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {role.commonProjects.map((project, index) => (
              <div
                key={index}
                className="bg-[#080B0D] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h4 className="text-sm font-bold text-[#FAF3E1]">
                      Capstone Milestone {index + 1}
                    </h4>
                  </div>
                  <p className="text-xs text-[#FAF3E1]/80 leading-relaxed">
                    {project}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#FAF3E1]/50">
                  <span>Benchmark: Deployed / Unit-Tested</span>
                  <span className="text-[#FF6D1F]">Included in roadmap</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interview Topics */}
      {activeTab === 'interview' && (
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#FAF3E1]">
              Technical Interview Question Domains
            </h3>
            <p className="text-xs text-[#FAF3E1]/60">
              Prepare for these core engineering concepts in our interactive STAR coaching simulator.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {role.interviewTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-[#080B0D] border border-white/10 rounded-xl p-4 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FF6D1F] shrink-0 mt-0.5" />
                <div className="text-xs text-[#FAF3E1]/90 font-medium leading-relaxed">
                  {topic}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleStartTechnicalAssessment}
              className="px-6 py-3 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-[#FF6D1F]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Diagnostic Assessment for {role.title}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Adjacent Roles */}
      {activeTab === 'adjacent' && role.adjacentRoles && (
        <div className="bg-[#222222] border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#FAF3E1]">
              Adjacent & Cross-Transferable Roles
            </h3>
            <p className="text-xs text-[#FAF3E1]/60">
              Building competencies for {role.title} also establishes high overlap with these engineering paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {role.adjacentRoles.map((adjTitle, index) => (
              <div
                key={index}
                className="bg-[#080B0D] border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-[#FF6D1F]/40 transition"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#FAF3E1]">
                    {adjTitle}
                  </h4>
                  <p className="text-[11px] text-[#FAF3E1]/60 mt-1">
                    High conceptual & tooling overlap with {role.title}.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const found = getRoleById(adjTitle.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                    setSelectedRole(found);
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-[#FAF3E1] transition"
                >
                  Explore Role
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
