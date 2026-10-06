import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { ROLES_CATALOG } from '../data/roles';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Quote, 
  Lightbulb, 
  GraduationCap, 
  FolderGit2,
  ExternalLink,
  Target,
  Compass,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Filter,
  Award,
  Hash,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import type { EvidenceClassificationType } from '../types';

type AnalysisTab = 'evidence_map' | 'project_analysis' | 'role_alignment' | 'improvements' | 'artifacts';

export const EvidenceAnalysisView: React.FC = () => {
  const { 
    extractedResume, 
    gapAnalysis, 
    setCurrentStep, 
    loadDemoScenario,
    profile,
    changeTargetRole
  } = useShift();

  const [activeTab, setActiveTab] = useState<AnalysisTab>('evidence_map');
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'demonstrated' | 'claimed' | 'missing'>('all');
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

  if (!extractedResume || !gapAnalysis) {
    return (
      <div className="max-w-[1280px] mx-auto py-16 px-6 text-center">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-10 max-w-lg mx-auto shadow-2xl">
          <Quote className="w-12 h-12 text-[#FF6D1F] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
            No Resume Evidence Analyzed
          </h2>
          <p className="text-xs text-[#96928A] mt-2 mb-6 leading-relaxed">
            Paste or upload an engineering resume to extract verifiable quotes, detect screening warnings, and calculate multi-signal evidence benchmarks.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setCurrentStep('setup')}
              className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider font-display transition cursor-pointer shadow-lg shadow-[#FF6D1F]/20"
            >
              PASTE RESUME & ANALYZE →
            </button>
            <button
              onClick={() => {
                loadDemoScenario('prd_frontend_beginner');
                setCurrentStep('analysis');
              }}
              className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer font-display transition"
            >
              <Lightbulb className="w-4 h-4 text-[#FF6D1F]" />
              <span>Explore an example engineering profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { candidateSummary, evidenceMap, projectAnalyses, roleAlignment, resumeImprovements, detectedLinks, quantifiedMetrics, standardsAndCompliance } = extractedResume;

  // Filter evidence map
  const filteredEvidence = (evidenceMap || []).filter(item => {
    if (evidenceFilter === 'demonstrated') return item.evidenceStrength === 'strong' || item.evidenceStrength === 'moderate';
    if (evidenceFilter === 'claimed') return item.evidenceType === 'claimed_only';
    if (evidenceFilter === 'missing') return item.evidenceType === 'not_observed';
    return true;
  });

  const getEvidenceTypeBadge = (type: EvidenceClassificationType) => {
    switch (type) {
      case 'internship':
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#B8D88A]/15 text-[#B8D88A] border border-[#B8D88A]/30">Internship / Work</span>;
      case 'academic_project':
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30">Academic Project</span>;
      case 'personal_project':
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30">Personal Project</span>;
      case 'lab_coursework':
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#F7C65B]/15 text-[#F7C65B] border border-[#F7C65B]/30">Lab / Coursework</span>;
      case 'competition':
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF6D1F]/15 text-[#FF6D1F] border border-[#FF6D1F]/30">Competition / Hackathon</span>;
      case 'claimed_only':
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#F7C65B]/15 text-[#F7C65B] border border-[#F7C65B]/30">Claimed Only</span>;
      case 'not_observed':
      default:
        return <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#96928A]/15 text-[#96928A] border border-[#96928A]/30">Not Observed</span>;
    }
  };

  const getEvidenceStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'strong':
        return <span className="text-[10px] font-mono font-bold text-[#B8D88A]">● Strong</span>;
      case 'moderate':
        return <span className="text-[10px] font-mono font-bold text-[#58A6FF]">● Moderate</span>;
      case 'weak':
        return <span className="text-[10px] font-mono font-bold text-[#F7C65B]">▲ Weak</span>;
      default:
        return <span className="text-[10px] font-mono text-[#96928A]">○ None</span>;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    if (confidence.includes('High')) {
      return <span className="text-[10px] text-[#B8D88A] bg-[#B8D88A]/10 px-2 py-0.5 rounded font-mono">High confidence</span>;
    } else if (confidence.includes('Medium')) {
      return <span className="text-[10px] text-[#58A6FF] bg-[#58A6FF]/10 px-2 py-0.5 rounded font-mono">Medium confidence</span>;
    }
    return <span className="text-[10px] text-[#F7C65B] bg-[#F7C65B]/10 px-2 py-0.5 rounded font-mono">Needs validation</span>;
  };

  const domainLabels: Record<string, string> = {
    software_it: 'Software & IT',
    ai_data: 'AI & Data Science',
    electronics_embedded: 'Electronics & Embedded',
    mechanical_manufacturing: 'Mechanical & Manufacturing',
    civil_infra: 'Civil & Infrastructure',
    chemical_bio_materials: 'Chemical & Materials',
    interdisciplinary: 'Robotics & Interdisciplinary'
  };

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10">
      {/* Target Role & Engineering Context Bar */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[24px] p-5 mb-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#FF6D1F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF6D1F]">
                Active Target Role
              </span>
              <span className="text-xs text-[#96928A]">•</span>
              <span className="text-xs text-[#FAF3E1] font-semibold">{profile.targetRoleTitle}</span>
            </div>
            <p className="text-xs text-[#96928A] mt-0.5">
              Resume evidence is evaluated specifically against this role's benchmark criteria.
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsRoleSelectorOpen(!isRoleSelectorOpen)}
            className="px-5 py-2.5 rounded-[18px] bg-[#080B0D] hover:bg-[#151a1e] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer font-display"
          >
            <Target className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Switch Target Role</span>
            <span className="text-[10px] bg-[#FF6D1F]/20 text-[#FF6D1F] px-1.5 py-0.2 rounded font-mono">
              {Object.keys(ROLES_CATALOG).length} available
            </span>
          </button>

          {/* Role Selector Dropdown */}
          {isRoleSelectorOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto bg-[#101416] border border-[rgba(250,243,225,0.2)] rounded-[22px] shadow-2xl p-4 z-50">
              <div className="text-xs font-bold uppercase tracking-wider text-[#96928A] mb-3 px-2">
                Select Engineering Role Benchmark
              </div>
              <div className="space-y-4">
                {Object.entries(
                  Object.values(ROLES_CATALOG).reduce((acc, role) => {
                    const dom = role.domain || 'software_it';
                    if (!acc[dom]) acc[dom] = [];
                    acc[dom].push(role);
                    return acc;
                  }, {} as Record<string, typeof ROLES_CATALOG[string][]>)
                ).map(([domain, roles]) => (
                  <div key={domain}>
                    <div className="text-[10px] font-mono uppercase text-[#FF6D1F] font-bold px-2 py-1 bg-[#080B0D] rounded-md mb-1.5">
                      {domainLabels[domain] || domain}
                    </div>
                    <div className="space-y-1">
                      {roles.map(r => (
                        <button
                          key={r.id}
                          onClick={() => {
                            changeTargetRole(r.id, r.title);
                            setIsRoleSelectorOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-[14px] text-xs transition flex items-center justify-between cursor-pointer ${
                            profile.targetRole === r.id
                              ? 'bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold border border-[#FF6D1F]/30'
                              : 'text-[#FAF3E1] hover:bg-[#1a2024]'
                          }`}
                        >
                          <span>{r.title}</span>
                          {profile.targetRole === r.id && (
                            <span className="text-[10px] font-mono">ACTIVE</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[rgba(250,243,225,0.12)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
              Engineering Resume Analyzer
            </span>
            <span className="text-[#96928A]">•</span>
            <span className="text-xs text-[#96928A]">Prompt 5 Grounding Engine</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
            Evidence Verification & Depth
          </h1>
          <p className="text-sm text-[#96928A] mt-2">
            Candidate: <strong className="text-[#FAF3E1]">{extractedResume.candidateName}</strong> • Rigorous multi-signal audit across branch, projects, and role benchmarks.
          </p>
        </div>

        <button
          onClick={() => setCurrentStep('gap')}
          className="px-6 py-3.5 rounded-[22px] bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)] font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer self-start sm:self-center font-display shadow-lg"
        >
          <span>VIEW ROLE GAP BENCHMARK →</span>
        </button>
      </div>

      {/* CANDIDATE SUMMARY BANNER (Prompt 5 - Section 1) */}
      {candidateSummary && (
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6D1F]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-[rgba(250,243,225,0.1)]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6D1F] font-bold">
                Executive Profile Summary
              </span>
              <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-1 flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-[#FF6D1F]" />
                {candidateSummary.engineeringBranch}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#FAF3E1]/10 text-[#FAF3E1] border border-[rgba(250,243,225,0.2)]">
                Level: {candidateSummary.currentLevel.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#B8D88A]/15 text-[#B8D88A] border border-[#B8D88A]/30">
                Grounding Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[20px] p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#96928A] font-bold block mb-1">
                Main Technical Direction
              </span>
              <p className="text-sm font-semibold text-[#FAF3E1]">
                {candidateSummary.mainTechnicalDirection}
              </p>
            </div>

            <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[20px] p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#96928A] font-bold block mb-1">
                Target Role Alignment
              </span>
              <p className="text-sm font-semibold text-[#FAF3E1]">
                {candidateSummary.targetRoleAlignment}
              </p>
            </div>
          </div>

          {/* Missing Context Warnings (Fact Grounding) */}
          {candidateSummary.missingContext.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[rgba(250,243,225,0.08)]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#F7C65B] font-bold flex items-center gap-1.5 mb-2.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Context Gaps Not Observed On Resume
              </span>
              <div className="flex flex-wrap gap-2">
                {candidateSummary.missingContext.map((gap, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-[#96928A] bg-[#080B0D] border border-[rgba(250,243,225,0.1)] px-3 py-1.5 rounded-[12px] flex items-center gap-1.5"
                  >
                    <span className="text-[#F7C65B]">•</span>
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HIGH-LEVEL AUDIT METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[22px] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#96928A]">Identified Skills</div>
          <div className="font-display text-3xl font-black text-[#FAF3E1] mt-1.5">
            {extractedResume.extractedSkills.length}
          </div>
          <div className="text-[10px] text-[#96928A] mt-1">Catalog items</div>
        </div>

        <div className="bg-[#101416] border border-[#B8D88A]/30 rounded-[22px] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#B8D88A]">Demonstrated</div>
          <div className="font-display text-3xl font-black text-[#B8D88A] mt-1.5">
            {gapAnalysis.demonstrated.length}
          </div>
          <div className="text-[10px] text-[#96928A] mt-1">Project verified</div>
        </div>

        <div className="bg-[#101416] border border-[#F7C65B]/30 rounded-[22px] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7C65B]">Claimed Only</div>
          <div className="font-display text-3xl font-black text-[#F7C65B] mt-1.5">
            {gapAnalysis.partial.length}
          </div>
          <div className="text-[10px] text-[#96928A] mt-1">Lacks code proof</div>
        </div>

        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[22px] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF6D1F]">Role Gaps</div>
          <div className="font-display text-3xl font-black text-[#FF6D1F] mt-1.5">
            {gapAnalysis.missing.length}
          </div>
          <div className="text-[10px] text-[#96928A] mt-1">For {profile.targetRoleTitle}</div>
        </div>

        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[22px] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#58A6FF]">Metrics Found</div>
          <div className="font-display text-3xl font-black text-[#58A6FF] mt-1.5">
            {quantifiedMetrics?.length || 0}
          </div>
          <div className="text-[10px] text-[#96928A] mt-1">Scale & stats</div>
        </div>

        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[22px] p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#FAF3E1]">Verified Links</div>
          <div className="font-display text-3xl font-black text-[#FAF3E1] mt-1.5">
            {(detectedLinks?.github?.length || 0) + (detectedLinks?.portfolio?.length || 0)}
          </div>
          <div className="text-[10px] text-[#96928A] mt-1">Public repos</div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-[rgba(250,243,225,0.12)] mb-8 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('evidence_map')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'evidence_map'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#96928A] hover:text-[#FAF3E1]'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Evidence Map ({evidenceMap?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('project_analysis')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'project_analysis'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#96928A] hover:text-[#FAF3E1]'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Project Deep-Dive ({projectAnalyses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('role_alignment')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'role_alignment'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#96928A] hover:text-[#FAF3E1]'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Role Alignment</span>
        </button>

        <button
          onClick={() => setActiveTab('improvements')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'improvements'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#96928A] hover:text-[#FAF3E1]'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Resume Improvements ({resumeImprovements?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('artifacts')}
          className={`pb-4 px-4 text-xs font-bold uppercase tracking-wider font-display transition cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'artifacts'
              ? 'border-[#FF6D1F] text-[#FF6D1F]'
              : 'border-transparent text-[#96928A] hover:text-[#FAF3E1]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Artifacts & Links</span>
        </button>
      </div>

      {/* TAB 1: EVIDENCE MAP (Prompt 5 - Section 2) */}
      {activeTab === 'evidence_map' && (
        <div className="space-y-6">
          {/* Subheader & Filter buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
                Competency Evidence Map
              </h2>
              <p className="text-xs text-[#96928A] mt-1">
                Every required skill evaluated with verbatim excerpts, source locations, and confidence levels.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#96928A]" />
              <button
                onClick={() => setEvidenceFilter('all')}
                className={`px-3 py-1.5 rounded-[14px] text-xs font-medium cursor-pointer transition ${
                  evidenceFilter === 'all'
                    ? 'bg-[#FAF3E1] text-[#222222] font-bold'
                    : 'bg-[#101416] text-[#96928A] hover:text-[#FAF3E1]'
                }`}
              >
                All ({evidenceMap?.length || 0})
              </button>
              <button
                onClick={() => setEvidenceFilter('demonstrated')}
                className={`px-3 py-1.5 rounded-[14px] text-xs font-medium cursor-pointer transition ${
                  evidenceFilter === 'demonstrated'
                    ? 'bg-[#B8D88A] text-[#222222] font-bold'
                    : 'bg-[#101416] text-[#96928A] hover:text-[#FAF3E1]'
                }`}
              >
                Demonstrated
              </button>
              <button
                onClick={() => setEvidenceFilter('claimed')}
                className={`px-3 py-1.5 rounded-[14px] text-xs font-medium cursor-pointer transition ${
                  evidenceFilter === 'claimed'
                    ? 'bg-[#F7C65B] text-[#222222] font-bold'
                    : 'bg-[#101416] text-[#96928A] hover:text-[#FAF3E1]'
                }`}
              >
                Claimed Only
              </button>
              <button
                onClick={() => setEvidenceFilter('missing')}
                className={`px-3 py-1.5 rounded-[14px] text-xs font-medium cursor-pointer transition ${
                  evidenceFilter === 'missing'
                    ? 'bg-[#FF6D1F] text-[#222222] font-bold'
                    : 'bg-[#101416] text-[#96928A] hover:text-[#FAF3E1]'
                }`}
              >
                Not Observed
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredEvidence.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-[22px] p-6 hover:border-[rgba(250,243,225,0.25)] transition shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-[#FAF3E1]">
                      {item.skillName}
                    </span>
                    {getEvidenceTypeBadge(item.evidenceType)}
                  </div>

                  <div className="flex items-center gap-3">
                    {getEvidenceStrengthBadge(item.evidenceStrength)}
                    {getConfidenceBadge(item.confidence)}
                  </div>
                </div>

                {/* Verbatim Excerpt */}
                {item.exactExcerpt ? (
                  <div className="bg-[#080B0D] border-l-2 border-[#B8D88A] p-4 rounded-r-[16px] rounded-l-[4px] my-3">
                    <div className="flex items-start gap-2">
                      <Quote className="w-4 h-4 text-[#B8D88A] flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-[#FAF3E1] font-mono italic leading-relaxed">
                        {item.exactExcerpt}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#96928A] font-mono mt-2 pl-6">
                      Source: <span className="text-[#FAF3E1]">{item.source}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#080B0D] p-3 rounded-[14px] my-3 text-xs text-[#96928A] italic">
                    Evidence source: <span className="text-[#FAF3E1]">{item.source}</span> — No verbatim execution quote found in resume projects.
                  </div>
                )}

                {/* Recommendation */}
                <div className="flex items-start gap-2 text-xs text-[#96928A] mt-3 pt-3 border-t border-[rgba(250,243,225,0.06)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6D1F] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#FAF3E1]">Recommendation:</strong> {item.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT DEEP-DIVE (Prompt 5 - Section 3) */}
      {activeTab === 'project_analysis' && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
              Engineering Project Analysis ({projectAnalyses?.length || 0})
            </h2>
            <p className="text-xs text-[#96928A] mt-1">
              Detailed technical breakdown for every project: industrial context, contributions, missing depth, and interview questions.
            </p>
          </div>

          <div className="space-y-6">
            {(projectAnalyses || []).map((proj, idx) => (
              <div
                key={idx}
                className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 shadow-xl space-y-5"
              >
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(250,243,225,0.1)]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6D1F] font-bold">
                      Project #{idx + 1}
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-0.5">
                      {proj.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#58A6FF]/15 text-[#58A6FF] border border-[#58A6FF]/30 self-start sm:self-auto">
                    {proj.userOrIndustrialContext}
                  </span>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Problem Solved */}
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[18px] p-4">
                    <span className="text-[11px] font-mono uppercase text-[#96928A] font-bold block mb-1">
                      Problem Solved
                    </span>
                    <p className="text-xs text-[#FAF3E1] leading-relaxed">
                      {proj.problemSolved}
                    </p>
                  </div>

                  {/* Technical Approach */}
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[18px] p-4">
                    <span className="text-[11px] font-mono uppercase text-[#96928A] font-bold block mb-1">
                      Technical Approach & Architecture
                    </span>
                    <p className="text-xs text-[#FAF3E1] leading-relaxed">
                      {proj.technicalApproach}
                    </p>
                  </div>
                </div>

                {/* Tools & Candidate Contribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tools Used */}
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[18px] p-4">
                    <span className="text-[11px] font-mono uppercase text-[#96928A] font-bold block mb-2">
                      Tools & Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.toolsUsed.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#101416] text-[#FAF3E1] border border-[rgba(250,243,225,0.14)]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Contribution */}
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[18px] p-4">
                    <span className="text-[11px] font-mono uppercase text-[#96928A] font-bold block mb-1">
                      Candidate Contribution
                    </span>
                    <p className="text-xs text-[#FAF3E1] leading-relaxed">
                      {proj.candidateContribution}
                    </p>
                  </div>
                </div>

                {/* Measurable Results & Missing Depth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Measurable Result */}
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[18px] p-4">
                    <span className="text-[11px] font-mono uppercase text-[#B8D88A] font-bold block mb-1">
                      Measurable Result
                    </span>
                    {proj.measurableResult ? (
                      <p className="text-xs text-[#B8D88A] font-mono font-semibold">
                        {proj.measurableResult}
                      </p>
                    ) : (
                      <p className="text-xs text-[#96928A] italic">
                        Not observed in resume — No quantifiable throughput, speedup, or user metric found.
                      </p>
                    )}
                  </div>

                  {/* Missing Technical Depth */}
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.08)] rounded-[18px] p-4">
                    <span className="text-[11px] font-mono uppercase text-[#F7C65B] font-bold block mb-1">
                      Missing Technical Depth (Screener Warning)
                    </span>
                    <p className="text-xs text-[#FAF3E1] leading-relaxed">
                      {proj.missingTechnicalDepth}
                    </p>
                  </div>
                </div>

                {/* Suggested Interview Questions */}
                {proj.suggestedInterviewQuestions.length > 0 && (
                  <div className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[20px] p-5">
                    <span className="text-[11px] font-mono uppercase text-[#FF6D1F] font-bold flex items-center gap-1.5 mb-3">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Suggested Technical Interview Questions For This Project
                    </span>
                    <div className="space-y-2">
                      {proj.suggestedInterviewQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="text-xs text-[#FAF3E1] font-mono flex items-start gap-2 bg-[#101416] p-3 rounded-[12px]">
                          <span className="text-[#FF6D1F] font-bold">Q{qIdx + 1}:</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROLE ALIGNMENT (Prompt 5 - Section 4) */}
      {activeTab === 'role_alignment' && roleAlignment && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
              Target Role Alignment: {roleAlignment.targetRoleTitle}
            </h2>
            <p className="text-xs text-[#96928A] mt-1">
              Direct comparison between candidate profile and target role industry expectations.
            </p>
          </div>

          {/* 4 Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Matches */}
            <div className="bg-[#101416] border border-[#B8D88A]/30 rounded-[26px] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(250,243,225,0.08)]">
                <CheckCircle2 className="w-5 h-5 text-[#B8D88A]" />
                <h3 className="font-display text-xl font-bold uppercase text-[#B8D88A]">
                  Strong Matches ({roleAlignment.strongMatches.length})
                </h3>
              </div>
              <div className="space-y-3">
                {roleAlignment.strongMatches.map((m, idx) => (
                  <div key={idx} className="bg-[#080B0D] p-3.5 rounded-[16px] text-xs">
                    <div className="font-bold text-[#FAF3E1] mb-1">{m.skill}</div>
                    <div className="text-[11px] text-[#96928A] font-mono line-clamp-2">{m.evidence}</div>
                  </div>
                ))}
                {roleAlignment.strongMatches.length === 0 && (
                  <p className="text-xs text-[#96928A] italic">No verified hands-on matches found yet.</p>
                )}
              </div>
            </div>

            {/* Partial Matches */}
            <div className="bg-[#101416] border border-[#F7C65B]/30 rounded-[26px] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(250,243,225,0.08)]">
                <AlertTriangle className="w-5 h-5 text-[#F7C65B]" />
                <h3 className="font-display text-xl font-bold uppercase text-[#F7C65B]">
                  Partial Matches ({roleAlignment.partialMatches.length})
                </h3>
              </div>
              <div className="space-y-3">
                {roleAlignment.partialMatches.map((m, idx) => (
                  <div key={idx} className="bg-[#080B0D] p-3.5 rounded-[16px] text-xs">
                    <div className="font-bold text-[#FAF3E1] mb-1">{m.skill}</div>
                    <div className="text-[11px] text-[#F7C65B]">{m.gap}</div>
                  </div>
                ))}
                {roleAlignment.partialMatches.length === 0 && (
                  <p className="text-xs text-[#96928A] italic">No unverified claims detected.</p>
                )}
              </div>
            </div>

            {/* Missing Requirements */}
            <div className="bg-[#101416] border border-[#FF6D1F]/30 rounded-[26px] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(250,243,225,0.08)]">
                <AlertCircle className="w-5 h-5 text-[#FF6D1F]" />
                <h3 className="font-display text-xl font-bold uppercase text-[#FF6D1F]">
                  Missing Requirements ({roleAlignment.missingRequirements.length})
                </h3>
              </div>
              <div className="space-y-3">
                {roleAlignment.missingRequirements.map((m, idx) => (
                  <div key={idx} className="bg-[#080B0D] p-3.5 rounded-[16px] text-xs">
                    <div className="font-bold text-[#FAF3E1] mb-1">{m.skill}</div>
                    <div className="text-[11px] text-[#96928A]">{m.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Relevant or Secondary Items */}
            <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(250,243,225,0.08)]">
                <Compass className="w-5 h-5 text-[#96928A]" />
                <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1]">
                  Non-Relevant / Secondary Items ({roleAlignment.nonRelevantItems.length})
                </h3>
              </div>
              <div className="space-y-3">
                {roleAlignment.nonRelevantItems.map((item, idx) => (
                  <div key={idx} className="bg-[#080B0D] p-3.5 rounded-[16px] text-xs text-[#96928A]">
                    <span className="text-[#FAF3E1] font-semibold">{item}</span>
                    <p className="text-[11px] mt-1">Secondary to {roleAlignment.targetRoleTitle} criteria — do not allocate prime resume real estate to this.</p>
                  </div>
                ))}
                {roleAlignment.nonRelevantItems.length === 0 && (
                  <p className="text-xs text-[#96928A] italic">All extracted skills align closely with the target role domain.</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Ordering Suggestions */}
          {roleAlignment.resumeOrderingSuggestions.length > 0 && (
            <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 shadow-xl">
              <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6D1F]" />
                Resume Layout & Section Ordering Recommendations
              </h3>
              <div className="space-y-3">
                {roleAlignment.resumeOrderingSuggestions.map((sug, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-[#FAF3E1]">
                    <span className="w-5 h-5 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-mono">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RESUME IMPROVEMENTS (Prompt 5 - Section 5) */}
      {activeTab === 'improvements' && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
              Fact-Grounded Resume Improvement Recommendations
            </h2>
            <p className="text-xs text-[#96928A] mt-1">
              Actionable enhancements based purely on your factual submissions. Never fabricates metrics or experience.
            </p>
          </div>

          {/* Strict Reliability Disclaimer Banner */}
          <div className="bg-[#080B0D] border-l-4 border-[#FF6D1F] p-4 rounded-r-[18px] text-xs text-[#FAF3E1] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#FF6D1F] flex-shrink-0" />
            <p>
              <strong>SkillForge AI Integrity Rule:</strong> We will never generate invented metrics, phantom internships, or fake certifications. All suggestions guide you to highlight real engineering depth that you personally executed.
            </p>
          </div>

          <div className="space-y-4">
            {(resumeImprovements || []).map((imp, idx) => (
              <div
                key={idx}
                className="bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-[22px] p-6 hover:border-[rgba(250,243,225,0.25)] transition shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-[#FAF3E1] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FF6D1F]/20 text-[#FF6D1F] font-bold flex items-center justify-center text-xs font-mono">
                      {idx + 1}
                    </span>
                    {imp.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#080B0D] text-[#FF6D1F] border border-[#FF6D1F]/30">
                      {imp.category.replace('_', ' ')}
                    </span>
                    {imp.affectedSection && (
                      <span className="text-[10px] font-mono text-[#96928A] bg-[#080B0D] px-2 py-0.5 rounded">
                        Section: {imp.affectedSection}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#96928A] leading-relaxed mt-2 pl-8">
                  {imp.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ARTIFACTS, LINKS & STANDARDS */}
      {activeTab === 'artifacts' && (
        <div className="space-y-6">
          <div className="pb-2">
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1]">
              Detected Artifacts, Repositories & Compliance Standards
            </h2>
            <p className="text-xs text-[#96928A] mt-1">
              Verifiable external links, quantitative numbers, and engineering regulatory standards parsed from your resume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repositories & Links */}
            <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-[#FF6D1F]" />
                Public Repositories & Links
              </h3>
              <div className="space-y-3">
                {detectedLinks?.github && detectedLinks.github.length > 0 ? (
                  detectedLinks.github.map((gh, idx) => (
                    <a
                      key={idx}
                      href={gh.startsWith('http') ? gh : `https://${gh}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-[16px] bg-[#080B0D] text-xs font-mono text-[#58A6FF] hover:underline"
                    >
                      <span>{gh}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))
                ) : (
                  <div className="p-4 rounded-[16px] bg-[#080B0D] text-xs text-[#F7C65B] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>No public GitHub repositories detected. Adding public code is vital for early-career screeners.</span>
                  </div>
                )}

                {detectedLinks?.portfolio && detectedLinks.portfolio.length > 0 && (
                  detectedLinks.portfolio.map((port, idx) => (
                    <a
                      key={idx}
                      href={port.startsWith('http') ? port : `https://${port}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-[16px] bg-[#080B0D] text-xs font-mono text-[#B8D88A] hover:underline"
                    >
                      <span>Portfolio: {port}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Standards & Compliance */}
            <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF6D1F]" />
                Engineering Standards & Compliance
              </h3>
              {standardsAndCompliance && standardsAndCompliance.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {standardsAndCompliance.map((std, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono font-bold px-3 py-1.5 rounded-[12px] bg-[#080B0D] text-[#FAF3E1] border border-[rgba(250,243,225,0.2)]"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-[16px] bg-[#080B0D] text-xs text-[#96928A]">
                  No formal industry standards (e.g. ISO, IEEE, ASME, OSHA, WCAG, MISRA) mentioned. If applicable in coursework, cite them.
                </div>
              )}
            </div>
          </div>

          {/* Quantified Metrics Showcase */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 shadow-xl">
            <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#FF6D1F]" />
              Detected Quantified Metrics ({quantifiedMetrics?.length || 0})
            </h3>
            {quantifiedMetrics && quantifiedMetrics.length > 0 ? (
              <div className="space-y-2">
                {quantifiedMetrics.map((met, idx) => (
                  <div key={idx} className="p-3 rounded-[14px] bg-[#080B0D] text-xs font-mono text-[#B8D88A] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>"{met}"</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-[16px] bg-[#080B0D] text-xs text-[#F7C65B] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Zero quantified metrics detected. Consider calculating speedup %, user counts, test pass rates, or request latency if known.</span>
              </div>
            )}
          </div>

          {/* Education & Background */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 shadow-xl">
            <h3 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#FF6D1F]" />
              Education & Academic Degrees
            </h3>
            <div className="space-y-3">
              {extractedResume.education.map((edu, idx) => (
                <div key={idx} className="bg-[#080B0D] border border-[rgba(250,243,225,0.1)] rounded-[18px] p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#FAF3E1]">{edu.institution}</div>
                    <div className="text-xs text-[#96928A]">{edu.degree}</div>
                  </div>
                  {edu.year && <span className="text-xs font-mono text-[#96928A]">{edu.year}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-8 mt-10 border-t border-[rgba(250,243,225,0.12)]">
        <button
          onClick={() => setCurrentStep('setup')}
          className="text-xs text-[#96928A] hover:text-[#FAF3E1] font-medium cursor-pointer transition flex items-center gap-1.5"
        >
          <span>← Edit Setup & Resume</span>
        </button>

        <button
          onClick={() => setCurrentStep('gap')}
          className="px-8 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer font-display shadow-lg shadow-[#FF6D1F]/20"
        >
          <span>STEP 03: BENCHMARK SKILL GAPS →</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
