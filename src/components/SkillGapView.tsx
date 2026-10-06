import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Award, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  RefreshCw, 
  Sparkles, 
  ChevronDown, 
  EyeOff, 
  FileText,
  Sliders,
  Check,
  Zap
} from 'lucide-react';
import { ROLE_TAXONOMIES } from '../data/roleTaxonomies';
import { DiagnosticAssessmentModal } from './DiagnosticAssessmentModal';
import type { 
  SkillJudgementResult, 
  ConfidenceTier, 
  GapPriorityLabel 
} from '../services/competencyAlgorithm';

export const SkillGapView: React.FC = () => {
  const { 
    gapAnalysis, 
    profile, 
    setCurrentStep, 
    loadDemoScenario,
    updateSkillSelfRating,
    disputeSkillEvidence,
    addCustomSkill,
    hideSkill,
    unhideSkill,
    recalculatePath,
    changeTargetRole,
    hiddenSkills,
    disputedSkills,
  } = useShift();

  const taxonomy = ROLE_TAXONOMIES[profile.targetRole] || ROLE_TAXONOMIES.frontend;

  // Local UI states
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high' | 'needs_validation' | 'supported'>('all');
  const [editingSkillName, setEditingSkillName] = useState<string | null>(null);
  const [customSkillModalOpen, setCustomSkillModalOpen] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);

  // Custom skill form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('core_technical');
  const [newSkillRequiredLevel, setNewSkillRequiredLevel] = useState(3);
  const [newSkillSelfLevel, setNewSkillSelfLevel] = useState(3);
  const [newSkillExcerpt, setNewSkillExcerpt] = useState('');

  if (!gapAnalysis || !taxonomy) {
    return (
      <div className="max-w-[1280px] mx-auto py-16 px-6 text-center">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-10 max-w-lg mx-auto shadow-2xl">
          <Award className="w-12 h-12 text-[#FF6D1F] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
            No Skill Gap Benchmark Generated
          </h2>
          <p className="text-xs text-[#96928A] mt-2 mb-6 leading-relaxed">
            Benchmark your resume evidence against multi-signal engineering competency taxonomies.
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
                setCurrentStep('gap');
              }}
              className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer font-display transition"
            >
              <Flame className="w-4 h-4 text-[#FF6D1F]" />
              <span>Explore an example profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const judgements: SkillJudgementResult[] = gapAnalysis.judgements || [];

  // Filter skills by tab
  const filteredJudgements = judgements.filter(j => {
    if (activeTab === 'critical') return j.priorityLabel === 'Critical next step';
    if (activeTab === 'high') return j.priorityLabel === 'High priority' || j.priorityLabel === 'Critical next step';
    if (activeTab === 'needs_validation') return j.confidence.tier === 'needs_validation';
    if (activeTab === 'supported') return j.priorityLabel === 'Already supported';
    return true;
  });

  const criticalCount = judgements.filter(j => j.priorityLabel === 'Critical next step').length;
  const highCount = judgements.filter(j => j.priorityLabel === 'High priority' || j.priorityLabel === 'Critical next step').length;
  const validationCount = judgements.filter(j => j.confidence.tier === 'needs_validation').length;
  const supportedCount = judgements.filter(j => j.priorityLabel === 'Already supported').length;

  const handleCreateCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addCustomSkill(
      newSkillName.trim(),
      newSkillCategory,
      newSkillRequiredLevel,
      newSkillSelfLevel,
      newSkillExcerpt.trim() || undefined
    );
    setNewSkillName('');
    setNewSkillExcerpt('');
    setCustomSkillModalOpen(false);
  };

  const getConfidenceBadge = (tier: ConfidenceTier) => {
    switch (tier) {
      case 'high_confidence':
        return {
          label: 'High confidence',
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
      case 'medium_confidence':
        return {
          label: 'Medium confidence',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case 'needs_validation':
        return {
          label: 'Needs validation',
          color: 'bg-[#FF6D1F]/15 text-[#FF6D1F] border-[#FF6D1F]/30',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const getPriorityBadge = (priority: GapPriorityLabel) => {
    switch (priority) {
      case 'Critical next step':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'High priority':
        return 'bg-[#FF6D1F]/20 text-[#FF6D1F] border-[#FF6D1F]/40';
      case 'Important':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Useful later':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'Already supported':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  const getEvidenceStateLabel = (state: string) => {
    switch (state) {
      case 'validated_by_assessment': return { label: 'Validated by Assessment', color: 'text-emerald-400' };
      case 'industry_evidence': return { label: 'Industry Evidence', color: 'text-emerald-300' };
      case 'project_demonstrated': return { label: 'Project Demonstrated', color: 'text-sky-300' };
      case 'coursework_only': return { label: 'Coursework Only', color: 'text-amber-300' };
      case 'partial_evidence': return { label: 'Partial Evidence', color: 'text-amber-300' };
      case 'claimed': return { label: 'Self-Claimed', color: 'text-orange-300' };
      default: return { label: 'Not Observed', color: 'text-red-400' };
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-[rgba(250,243,225,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
              Transparent Competency Engine
            </span>
            <span className="text-[#96928A]">•</span>
            <span className="text-xs text-[#96928A]">Multi-Signal Judgement Algorithm</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
              {taxonomy.title} Competency Benchmark
            </h1>
            
            {/* Target Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleSelectOpen(prev => !prev)}
                className="p-2 rounded-xl bg-[#101416] border border-[rgba(250,243,225,0.2)] text-[#FAF3E1] hover:border-[#FF6D1F] transition text-xs flex items-center gap-1 cursor-pointer"
                title="Change Target Role"
              >
                <Sliders className="w-3.5 h-3.5 text-[#FF6D1F]" />
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleSelectOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#101416] border border-[rgba(250,243,225,0.2)] rounded-2xl p-2 shadow-2xl z-30 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#96928A] font-bold">
                    Switch Target Role
                  </div>
                  {Object.values(ROLE_TAXONOMIES).map(tax => (
                    <button
                      key={tax.id}
                      onClick={() => {
                        changeTargetRole(tax.id, tax.title);
                        setRoleSelectOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        profile.targetRole === tax.id 
                          ? 'bg-[#FF6D1F]/20 text-[#FF6D1F]' 
                          : 'text-[#FAF3E1] hover:bg-[#222222]'
                      }`}
                    >
                      <span>{tax.title}</span>
                      {profile.targetRole === tax.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#96928A] mt-2 max-w-3xl leading-relaxed">
            Unlike keyword scanners, SkillForge AI calibrates your capability across 5 transparent signals: self-assessment, resume evidence, project artifacts, diagnostic checks, and interview performance.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setDiagnosticModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#FF6D1F]/15 hover:bg-[#FF6D1F]/25 text-[#FF6D1F] border border-[#FF6D1F]/40 font-mono text-xs font-bold uppercase transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF6D1F]/10"
          >
            <Zap className="w-4 h-4 text-[#FF6D1F]" />
            <span>Take Diagnostic Check</span>
          </button>

          <button
            onClick={() => setCustomSkillModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)] font-mono text-xs font-semibold uppercase transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Add Skill</span>
          </button>

          <button
            onClick={recalculatePath}
            className="p-2.5 rounded-2xl bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)] transition cursor-pointer"
            title="Recalculate Roadmap"
          >
            <RefreshCw className="w-4 h-4 text-[#FAF3E1]/80" />
          </button>

          <button
            onClick={() => setCurrentStep('path')}
            className="px-6 py-2.5 rounded-2xl bg-[#FAF3E1] hover:bg-white text-[#222222] font-display font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md"
          >
            VIEW PATH →
          </button>
        </div>
      </div>

      {/* Model Transparency Formula Banner */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[rgba(250,243,225,0.08)] mb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#FF6D1F]" />
            <div>
              <h3 className="font-display text-sm font-bold uppercase text-[#FAF3E1]">
                Transparent Multi-Signal Scoring Weights
              </h3>
              <p className="text-[11px] text-[#96928A]">
                Dynamic Weight Normalization: Missing signals automatically re-weight available signals so unobserved inputs are never penalized as zero.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-mono text-[#96928A]">Readiness Benchmark</div>
            <div className="font-display text-2xl font-black text-[#FAF3E1]">
              {gapAnalysis.overallReadinessScore}% Target Role Match
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.08)]">
            <div className="text-[10px] font-mono uppercase text-[#96928A]">Resume Evidence</div>
            <div className="font-display text-lg font-bold text-[#FAF3E1] mt-0.5">35%</div>
            <div className="text-[9px] text-[#FAF3E1]/60">Verifiable Projects</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.08)]">
            <div className="text-[10px] font-mono uppercase text-[#96928A]">Diagnostic Assessment</div>
            <div className="font-display text-lg font-bold text-[#FAF3E1] mt-0.5">30%</div>
            <div className="text-[9px] text-[#FAF3E1]/60">Concept Checks</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.08)]">
            <div className="text-[10px] font-mono uppercase text-[#96928A]">Interview Signal</div>
            <div className="font-display text-lg font-bold text-[#FAF3E1] mt-0.5">20%</div>
            <div className="text-[9px] text-[#FAF3E1]/60">Verbal Technical Proof</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.08)]">
            <div className="text-[10px] font-mono uppercase text-[#96928A]">Self-Assessment</div>
            <div className="font-display text-lg font-bold text-[#FAF3E1] mt-0.5">10%</div>
            <div className="text-[9px] text-[#FAF3E1]/60">Candidate Calibration</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.08)]">
            <div className="text-[10px] font-mono uppercase text-[#96928A]">Task Completion</div>
            <div className="font-display text-lg font-bold text-[#FAF3E1] mt-0.5">5%</div>
            <div className="text-[9px] text-[#FAF3E1]/60">Roadmap Progress</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[rgba(250,243,225,0.1)] pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-[#FAF3E1] text-[#222222]'
              : 'text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416]'
          }`}
        >
          <span>All Competencies</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{judgements.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('critical')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'critical'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Critical Next Steps</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{criticalCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('high')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'high'
              ? 'bg-[#FF6D1F] text-[#222222] shadow-lg shadow-[#FF6D1F]/20'
              : 'text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416]'
          }`}
        >
          <span>High Priority</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{highCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('needs_validation')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'needs_validation'
              ? 'bg-[#FF6D1F]/20 text-[#FF6D1F] border border-[#FF6D1F]'
              : 'text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Needs Validation</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{validationCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('supported')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'supported'
              ? 'bg-emerald-600 text-white'
              : 'text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Already Supported</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{supportedCount}</span>
        </button>

        {hiddenSkills.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-[#96928A]">{hiddenSkills.length} hidden:</span>
            {hiddenSkills.map(h => (
              <button
                key={h}
                onClick={() => unhideSkill(h)}
                className="px-2 py-0.5 rounded-lg bg-[#222222] hover:bg-[#333333] text-[10px] font-mono text-[#FAF3E1] cursor-pointer"
                title={`Restore ${h} to roadmap`}
              >
                + {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skill Cards Grid */}
      <div className="space-y-4 mb-12">
        {filteredJudgements.map(j => {
          const confBadge = getConfidenceBadge(j.confidence.tier);
          const priorityClass = getPriorityBadge(j.priorityLabel);
          const evState = getEvidenceStateLabel(j.evidenceState);
          const isEditing = editingSkillName === j.skillName;
          const isDisputed = disputedSkills.includes(j.skillName);

          return (
            <div
              key={j.skillId || j.skillName}
              className={`bg-[#101416] border rounded-[24px] p-6 shadow-xl transition-all ${
                isDisputed
                  ? 'border-dashed border-red-500/40 bg-[#140e10]'
                  : 'border-[rgba(250,243,225,0.14)] hover:border-[rgba(250,243,225,0.25)]'
              }`}
            >
              {/* Top Row: Title, Badges, Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(250,243,225,0.08)]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-lg font-bold text-[#FAF3E1]">
                    {j.skillName}
                  </span>

                  {j.isCustomSkill && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      Custom Skill
                    </span>
                  )}

                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${priorityClass}`}>
                    {j.priorityLabel}
                  </span>

                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${confBadge.color}`}>
                    {confBadge.icon}
                    <span>{confBadge.label}</span>
                  </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setEditingSkillName(isEditing ? null : j.skillName)}
                    className="p-1.5 rounded-lg text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#222222] transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Edit Self Rating"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">Self-Rate</span>
                  </button>

                  <button
                    onClick={() => disputeSkillEvidence(j.skillName)}
                    className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer ${
                      isDisputed 
                        ? 'text-red-400 bg-red-950/30' 
                        : 'text-[#96928A] hover:text-red-300 hover:bg-[#222222]'
                    }`}
                    title={isDisputed ? "Restore resume evidence" : "Mark resume evidence as inaccurate"}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono">
                      {isDisputed ? 'Disputed' : 'Dispute Evidence'}
                    </span>
                  </button>

                  <button
                    onClick={() => hideSkill(j.skillName)}
                    className="p-1.5 rounded-lg text-[#96928A] hover:text-red-300 hover:bg-[#222222] transition text-xs cursor-pointer"
                    title="Hide skill from roadmap"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Edit Self-Rating Bar (Collapsible) */}
              {isEditing && (
                <div className="mt-3 p-3.5 rounded-2xl bg-[#080B0D] border border-[#FF6D1F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div>
                    <div className="text-xs font-bold text-[#FAF3E1]">Adjust Your Self-Evaluation:</div>
                    <div className="text-[11px] text-[#96928A]">
                      Update your proficiency rating from 1 (Novice) to 5 (Production-ready).
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const currentVal = profile.selfAssessment?.[j.skillName] ?? Math.round(j.currentLevel);
                      return (
                        <button
                          key={lvl}
                          onClick={() => {
                            updateSkillSelfRating(j.skillName, lvl);
                            setEditingSkillName(null);
                          }}
                          className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                            currentVal === lvl
                              ? 'bg-[#FF6D1F] text-[#222222] shadow-md shadow-[#FF6D1F]/20'
                              : 'bg-[#171C1F] text-[#FAF3E1] hover:bg-[#222222]'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Main Metric Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
                {/* Level Bar */}
                <div className="p-3.5 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.06)] md:col-span-1">
                  <div className="flex items-center justify-between text-xs text-[#96928A] font-mono mb-1.5">
                    <span>Current vs Required</span>
                    <span className="font-bold text-[#FAF3E1]">
                      {j.currentLevel.toFixed(1)} / {j.requiredLevel}.0
                    </span>
                  </div>

                  {/* Level Segments */}
                  <div className="w-full bg-[#171C1F] h-2.5 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        j.currentLevel >= j.requiredLevel ? 'bg-emerald-400' : 'bg-[#FF6D1F]'
                      }`}
                      style={{ width: `${Math.min(100, (j.currentLevel / 5.0) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#96928A] mt-2">
                    <span>Gap: {(j.skillGap * 100).toFixed(0)}%</span>
                    <span className={evState.color}>{evState.label}</span>
                  </div>
                </div>

                {/* Signals Footprint */}
                <div className="p-3.5 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.06)] md:col-span-3 flex flex-wrap items-center gap-2">
                  <div className="text-[10px] font-mono uppercase text-[#96928A] w-full mb-1">
                    Independent Verification Signals:
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#171C1F] text-[#FAF3E1] border border-[rgba(250,243,225,0.08)]">
                    Self-claim: <strong className="text-[#FF6D1F]">{j.activeSignals.selfAssessment ?? 'None'}</strong>
                  </span>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#171C1F] text-[#FAF3E1] border border-[rgba(250,243,225,0.08)]">
                    Resume proof: <strong className="text-sky-300">{isDisputed ? 'Disputed (0)' : j.activeSignals.resumeEvidence?.toFixed(1) ?? 'None'}</strong>
                  </span>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#171C1F] text-[#FAF3E1] border border-[rgba(250,243,225,0.08)]">
                    Diagnostic check: <strong className="text-emerald-400">{j.activeSignals.diagnosticScore?.toFixed(1) ?? 'Not taken'}</strong>
                  </span>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#171C1F] text-[#FAF3E1] border border-[rgba(250,243,225,0.08)]">
                    Interview: <strong className="text-purple-300">{j.activeSignals.interviewSignal?.toFixed(1) ?? 'Pending'}</strong>
                  </span>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-[#171C1F] text-[#FAF3E1] border border-[rgba(250,243,225,0.08)]">
                    Confidence: <strong className="text-[#FAF3E1]">{j.confidence.confidenceScore}%</strong>
                  </span>
                </div>
              </div>

              {/* Evidence Excerpt Quote if available */}
              {j.evidenceExcerpt && !isDisputed && (
                <div className="mb-3.5 p-3 rounded-xl bg-[#080B0D] border-l-2 border-[#FF6D1F] text-xs font-mono text-[#FAF3E1]/80">
                  <span className="text-[#FF6D1F] font-bold">Verbatim Evidence: </span>
                  {j.evidenceExcerpt}
                </div>
              )}

              {/* Why It Matters & Validation Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[rgba(250,243,225,0.08)] text-xs text-[#96928A]">
                <div>
                  <strong className="text-[#FAF3E1] block mb-0.5 font-display text-[11px] uppercase tracking-wider">
                    Why It Matters:
                  </strong>
                  <p className="leading-relaxed">{j.whyItMatters}</p>
                </div>

                <div>
                  <strong className="text-[#FAF3E1] block mb-0.5 font-display text-[11px] uppercase tracking-wider">
                    How To Validate:
                  </strong>
                  <p className="leading-relaxed text-amber-200/80">{j.howToValidate}</p>
                </div>

                <div>
                  <strong className="text-[#FAF3E1] block mb-0.5 font-display text-[11px] uppercase tracking-wider">
                    Recommended Task:
                  </strong>
                  <p className="leading-relaxed text-emerald-300/80">{j.recommendedTask}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[rgba(250,243,225,0.12)]">
        <button
          onClick={() => setCurrentStep('analysis')}
          className="text-xs text-[#96928A] hover:text-[#FAF3E1] font-medium cursor-pointer"
        >
          ← Back to Resume Evidence
        </button>

        <button
          onClick={() => setCurrentStep('path')}
          className="w-full sm:w-auto px-8 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer font-display shadow-lg shadow-[#FF6D1F]/20"
        >
          <span>PROCEED TO {profile.durationDays}-DAY LEARNING PATH →</span>
        </button>
      </div>

      {/* Diagnostic Assessment Modal */}
      <DiagnosticAssessmentModal
        isOpen={diagnosticModalOpen}
        onClose={() => setDiagnosticModalOpen(false)}
        onAssessmentCompleted={() => {
          recalculatePath();
        }}
      />

      {/* Add Custom Skill Modal */}
      {customSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.18)] rounded-[26px] p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-2">
              Add Custom Engineering Skill
            </h3>
            <p className="text-xs text-[#96928A] mb-5">
              Add specialized frameworks, proprietary tools, or interdisciplinary competencies to your evaluation matrix.
            </p>

            <form onSubmit={handleCreateCustomSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#FAF3E1] mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. Apache Kafka, SolidWorks, PyTorch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B0D] border border-[rgba(250,243,225,0.18)] text-sm text-[#FAF3E1] focus:border-[#FF6D1F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#FAF3E1] mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={e => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B0D] border border-[rgba(250,243,225,0.18)] text-sm text-[#FAF3E1] outline-none"
                >
                  <option value="core_technical">Core Technical / Engineering</option>
                  <option value="tools_libraries">Frameworks, Libraries & Tools</option>
                  <option value="architecture_concepts">Architecture & System Concepts</option>
                  <option value="testing_deployment">Testing, CI/CD & Deployment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#FAF3E1] mb-1">
                    Your Level (1-5)
                  </label>
                  <select
                    value={newSkillSelfLevel}
                    onChange={e => setNewSkillSelfLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B0D] border border-[rgba(250,243,225,0.18)] text-sm text-[#FAF3E1] outline-none"
                  >
                    <option value={1}>1 - Novice</option>
                    <option value={2}>2 - Academic</option>
                    <option value={3}>3 - Project-ready</option>
                    <option value={4}>4 - Proficient</option>
                    <option value={5}>5 - Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#FAF3E1] mb-1">
                    Required Level (1-5)
                  </label>
                  <select
                    value={newSkillRequiredLevel}
                    onChange={e => setNewSkillRequiredLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B0D] border border-[rgba(250,243,225,0.18)] text-sm text-[#FAF3E1] outline-none"
                  >
                    <option value={2}>2 - Foundation</option>
                    <option value={3}>3 - Working</option>
                    <option value={4}>4 - Critical/High</option>
                    <option value={5}>5 - Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#FAF3E1] mb-1">
                  Project Evidence / Excerpt (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newSkillExcerpt}
                  onChange={e => setNewSkillExcerpt(e.target.value)}
                  placeholder="e.g. Built microservice ingestion pipeline handling 10k msgs/sec in semester project"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B0D] border border-[rgba(250,243,225,0.18)] text-xs text-[#FAF3E1] focus:border-[#FF6D1F] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(250,243,225,0.1)]">
                <button
                  type="button"
                  onClick={() => setCustomSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#96928A] hover:text-[#FAF3E1] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-mono text-xs font-bold uppercase transition"
                >
                  Add Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
