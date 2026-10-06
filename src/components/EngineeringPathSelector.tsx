import React, { useState } from 'react';
import { 
  getAllBranches, 
  getBranchById, 
  getStreamsForBranch, 
  getSpecializationsForStream 
} from '../data/engineeringTaxonomy';
import { ROLES_CATALOG, getRoleById, type EngineeringRole } from '../data/roles';
import { SKILLS_CATALOG } from '../data/skills';
import { 
  GraduationCap, 
  Layers, 
  Target, 
  Cpu, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import type { UserCareerProfile } from '../types';

interface EngineeringPathSelectorProps {
  profile: UserCareerProfile;
  onChange: (updated: Partial<UserCareerProfile>) => void;
}

export const EngineeringPathSelector: React.FC<EngineeringPathSelectorProps> = ({
  profile,
  onChange,
}) => {
  const branches = getAllBranches();

  // Branch state
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    return profile.engineeringBranch || 'cse';
  });

  // Stream state
  const availableStreams = getStreamsForBranch(selectedBranchId);
  const [selectedStreamId, setSelectedStreamId] = useState<string>(() => {
    return profile.stream && availableStreams.some(s => s.id === profile.stream)
      ? profile.stream
      : availableStreams[0]?.id || '';
  });

  // Specialization state
  const availableSpecs = getSpecializationsForStream(selectedBranchId, selectedStreamId);
  const [selectedSpecId, setSelectedSpecId] = useState<string>(() => {
    return profile.specialization && availableSpecs.some(s => s.id === profile.specialization)
      ? profile.specialization
      : availableSpecs[0]?.id || '';
  });

  // Role state
  const activeSpec = availableSpecs.find(s => s.id === selectedSpecId);
  const availableRoleIds = activeSpec ? activeSpec.roleIds : ['frontend', 'backend', 'data_analyst'];
  const [selectedRoleId, setSelectedRoleId] = useState<string>(() => {
    return profile.targetRole && availableRoleIds.includes(profile.targetRole)
      ? profile.targetRole
      : availableRoleIds[0] || 'frontend';
  });

  // Custom branch state (for "other")
  const [customBranchText, setCustomBranchText] = useState(profile.branchTitle || '');
  const [customSpecText, setCustomSpecText] = useState('');

  // Handle cascading updates when branch changes
  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    const branch = getBranchById(branchId);
    const streams = getStreamsForBranch(branchId);
    const nextStream = streams[0];
    const nextStreamId = nextStream ? nextStream.id : '';
    setSelectedStreamId(nextStreamId);

    const specs = nextStream ? nextStream.specializations : [];
    const nextSpec = specs[0];
    const nextSpecId = nextSpec ? nextSpec.id : '';
    setSelectedSpecId(nextSpecId);

    const roleIds = nextSpec ? nextSpec.roleIds : ['frontend', 'backend', 'data_analyst'];
    const nextRoleId = roleIds[0] || 'frontend';
    setSelectedRoleId(nextRoleId);

    const roleObj = getRoleById(nextRoleId);

    onChange({
      engineeringBranch: branchId,
      branchTitle: branch ? branch.name : branchId,
      stream: nextStreamId,
      specialization: nextSpecId,
      targetRole: nextRoleId,
      targetRoleTitle: roleObj ? roleObj.title : 'Software Engineer',
    });
  };

  // Handle stream change
  const handleStreamSelect = (streamId: string) => {
    setSelectedStreamId(streamId);
    const specs = getSpecializationsForStream(selectedBranchId, streamId);
    const nextSpec = specs[0];
    const nextSpecId = nextSpec ? nextSpec.id : '';
    setSelectedSpecId(nextSpecId);

    const roleIds = nextSpec ? nextSpec.roleIds : ['frontend', 'backend'];
    const nextRoleId = roleIds[0] || 'frontend';
    setSelectedRoleId(nextRoleId);

    const roleObj = getRoleById(nextRoleId);

    onChange({
      stream: streamId,
      specialization: nextSpecId,
      targetRole: nextRoleId,
      targetRoleTitle: roleObj ? roleObj.title : 'Software Engineer',
    });
  };

  // Handle specialization change
  const handleSpecSelect = (specId: string) => {
    setSelectedSpecId(specId);
    const spec = availableSpecs.find(s => s.id === specId);
    const roleIds = spec ? spec.roleIds : ['frontend'];
    const nextRoleId = roleIds[0] || 'frontend';
    setSelectedRoleId(nextRoleId);

    const roleObj = getRoleById(nextRoleId);

    onChange({
      specialization: specId,
      targetRole: nextRoleId,
      targetRoleTitle: roleObj ? roleObj.title : 'Software Engineer',
    });
  };

  // Handle role change
  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const roleObj = getRoleById(roleId);
    onChange({
      targetRole: roleId,
      targetRoleTitle: roleObj ? roleObj.title : roleId,
    });
  };

  // Active role details for skill preview
  const currentRoleObj: EngineeringRole | undefined = getRoleById(selectedRoleId) || ROLES_CATALOG['frontend'];

  return (
    <div className="space-y-6">
      
      {/* Cascading Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tier 1: Engineering Branch */}
        <div className="p-4 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <label className="text-[11px] font-mono text-[#FAF3E1]/70 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>1. Discipline / Branch</span>
          </label>
          <div className="relative">
            <select
              value={selectedBranchId}
              onChange={(e) => handleBranchSelect(e.target.value)}
              className="w-full bg-[#101416] border border-[rgba(250,243,225,0.16)] rounded-xl py-2.5 px-3 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F] transition appearance-none cursor-pointer pr-8 font-sans font-medium"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#FAF3E1]/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {selectedBranchId === 'other' && (
            <input
              type="text"
              value={customBranchText}
              onChange={(e) => {
                setCustomBranchText(e.target.value);
                onChange({ branchTitle: e.target.value });
              }}
              placeholder="Specify custom discipline name..."
              className="mt-2.5 w-full bg-[#101416] border border-[#FF6D1F]/40 rounded-xl py-2 px-3 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
            />
          )}
        </div>

        {/* Tier 2: Stream */}
        <div className="p-4 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <label className="text-[11px] font-mono text-[#FAF3E1]/70 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>2. Academic Stream</span>
          </label>
          <div className="relative">
            <select
              value={selectedStreamId}
              onChange={(e) => handleStreamSelect(e.target.value)}
              className="w-full bg-[#101416] border border-[rgba(250,243,225,0.16)] rounded-xl py-2.5 px-3 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F] transition appearance-none cursor-pointer pr-8 font-sans font-medium"
            >
              {availableStreams.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#FAF3E1]/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[10px] text-[#FAF3E1]/50 mt-2 truncate font-sans">
            {availableStreams.find(s => s.id === selectedStreamId)?.description || 'Curriculum stream focus'}
          </p>
        </div>

        {/* Tier 3: Specialization */}
        <div className="p-4 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <label className="text-[11px] font-mono text-[#FAF3E1]/70 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>3. Specialization</span>
          </label>
          <div className="relative">
            <select
              value={selectedSpecId}
              onChange={(e) => handleSpecSelect(e.target.value)}
              className="w-full bg-[#101416] border border-[rgba(250,243,225,0.16)] rounded-xl py-2.5 px-3 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F] transition appearance-none cursor-pointer pr-8 font-sans font-medium"
            >
              {availableSpecs.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#FAF3E1]/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {selectedBranchId === 'other' && (
            <input
              type="text"
              value={customSpecText}
              onChange={(e) => {
                setCustomSpecText(e.target.value);
                onChange({ specialization: e.target.value });
              }}
              placeholder="Custom technical focus..."
              className="mt-2.5 w-full bg-[#101416] border border-[#FF6D1F]/40 rounded-xl py-2 px-3 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
            />
          )}
          <p className="text-[10px] text-[#FAF3E1]/50 mt-2 truncate font-sans">
            {activeSpec?.description || 'Technical specialization target'}
          </p>
        </div>

        {/* Tier 4: Target Role */}
        <div className="p-4 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <label className="text-[11px] font-mono text-[#FAF3E1]/70 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>4. Target Role</span>
          </label>
          <div className="relative">
            <select
              value={selectedRoleId}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="w-full bg-[#101416] border border-[rgba(250,243,225,0.16)] rounded-xl py-2.5 px-3 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F] transition appearance-none cursor-pointer pr-8 font-sans font-medium font-bold text-[#FF6D1F]"
            >
              {availableRoleIds.map(rId => {
                const r = getRoleById(rId);
                return (
                  <option key={rId} value={rId}>
                    {r ? r.title : rId}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-[#FAF3E1]/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <p className="text-[10px] text-[#FAF3E1]/60 mt-2 font-mono">
            {currentRoleObj?.requiredSkills.length || 0} required skills
          </p>
        </div>

      </div>

      {/* Dynamic Role Preview Card */}
      {currentRoleObj && (
        <div className="p-6 rounded-3xl bg-[#080B0D] border border-[rgba(250,243,225,0.14)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(250,243,225,0.08)] mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6D1F]">
                  Industry Role Blueprint
                </span>
                <span className="text-xs text-[#FAF3E1]/40">•</span>
                <span className="text-xs font-mono text-[#FAF3E1]/60 capitalize">
                  {currentRoleObj.domain.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#FAF3E1]">
                {currentRoleObj.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF3E1]/70 mt-1 max-w-3xl font-sans">
                {currentRoleObj.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span className="px-3 py-1.5 rounded-full bg-[#FF6D1F]/10 border border-[#FF6D1F]/30 text-[#FF6D1F] text-xs font-mono font-semibold">
                {currentRoleObj.requiredSkills.length} Core Skills Mapped
              </span>
            </div>
          </div>

          {/* Required Skills Matrix Preview */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#FAF3E1]/80 uppercase tracking-wider flex items-center justify-between">
              <span>Required Engineering Competencies & Minimum Benchmarks</span>
              <span className="text-[11px] text-[#FAF3E1]/50 font-normal">Level 0 (Novice) to 5 (Industry-Ready)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentRoleObj.requiredSkills.map(req => {
                const skillDef = SKILLS_CATALOG[req.skillId];
                return (
                  <div
                    key={req.skillId}
                    className="p-3.5 rounded-2xl bg-[#101416] border border-[rgba(250,243,225,0.08)] hover:border-[rgba(250,243,225,0.16)] transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FAF3E1] font-display">
                          {req.skillName}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                          req.importance === 'critical'
                            ? 'bg-[#ED6A5A]/20 text-[#ED6A5A] border border-[#ED6A5A]/30'
                            : req.importance === 'high'
                            ? 'bg-[#FF6D1F]/20 text-[#FF6D1F] border border-[#FF6D1F]/30'
                            : 'bg-[#222222] text-[#FAF3E1]/60'
                        }`}>
                          {req.importance}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-[#FAF3E1]/70">
                        Min: <strong className="text-[#FF6D1F]">Level {req.minimumLevel}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#FAF3E1]/60 font-sans leading-relaxed">
                      {req.benchmarkDescription}
                    </p>

                    {skillDef && (
                      <div className="mt-2 pt-2 border-t border-[rgba(250,243,225,0.05)] flex items-center justify-between text-[10px] font-mono text-[#FAF3E1]/40">
                        <span className="capitalize">{skillDef.category.replace('_', ' ')}</span>
                        <span>Suggested: {skillDef.suggestedEvidenceTypes.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence Examples Footer */}
          {currentRoleObj.evidenceExamples && currentRoleObj.evidenceExamples.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[rgba(250,243,225,0.08)] text-xs font-sans text-[#FAF3E1]/70">
              <div className="text-[11px] font-mono uppercase text-[#FF6D1F] font-bold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF6D1F]" />
                <span>Verifiable Resume Evidence Examples:</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                {currentRoleObj.evidenceExamples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#FAF3E1]/80">
                    <span className="text-[#FF6D1F]">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
