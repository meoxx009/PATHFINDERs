import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  Info,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useShift } from '../context/ShiftContext';
import { getAllRoles, calculateInterestMatch, calculateSkillOverlap, isBranchAligned, type CareerRole } from '../data/roles';
import { ENGINEERING_BRANCHES } from '../data/engineeringTaxonomy';

const DOMAIN_LABELS: Record<string, { label: string; color: string }> = {
  software_it: { label: 'Software & IT', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  ai_data: { label: 'AI & Data Science', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  electronics_embedded: { label: 'Electronics & Embedded', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  mechanical_manufacturing: { label: 'Mechanical & Robotics', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  civil_infra: { label: 'Civil & Infrastructure', color: 'bg-stone-500/10 text-stone-300 border-stone-500/30' },
  chemical_bio_materials: { label: 'Chemical & Bio', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
  interdisciplinary: { label: 'Interdisciplinary', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' }
};

export const ExploreRolesView: React.FC = () => {
  const {
    profile,
    extractedResume,
    setSelectedRole,
    changeTargetRole,
    setCurrentStep,
    bookmarkedRoleIds,
    toggleBookmarkRole
  } = useShift();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>(profile.engineeringBranch || 'all');
  const [selectedInterest, setSelectedInterest] = useState<string>('all');
  const [onlyBeginnerFriendly, setOnlyBeginnerFriendly] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'overlap' | 'title' | 'weeks'>('match');

  const allRoles = useMemo(() => getAllRoles(), []);

  // Extract user skills from extracted resume or profile
  const userSkills = useMemo(() => {
    return extractedResume?.extractedSkills || [];
  }, [extractedResume]);

  // Unique interest tags from catalog
  const availableInterests = useMemo(() => {
    const set = new Set<string>();
    allRoles.forEach(r => r.interestTags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [allRoles]);

  // Filtered and sorted roles
  const filteredRoles = useMemo(() => {
    let result = allRoles.filter(role => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = role.title.toLowerCase().includes(q);
        const matchesDesc = role.description.toLowerCase().includes(q);
        const matchesSummary = role.summary.toLowerCase().includes(q);
        const matchesSkills = role.requiredSkills.some(s => s.skillName.toLowerCase().includes(q));
        const matchesTools = role.tools.some(t => t.toLowerCase().includes(q));
        const matchesFamily = role.engineeringFamilies.some(f => f.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSummary && !matchesSkills && !matchesTools && !matchesFamily) {
          return false;
        }
      }

      // Domain filter
      if (selectedDomain !== 'all' && role.domain !== selectedDomain) {
        return false;
      }

      // Branch filter (non-restrictive: filters if selected, but users can always explore all)
      if (selectedBranch !== 'all') {
        const matchesBranch = role.engineeringFamilies.some(fam =>
          fam.toLowerCase().includes(selectedBranch.toLowerCase()) ||
          selectedBranch.toLowerCase().includes(fam.toLowerCase())
        );
        if (!matchesBranch) return false;
      }

      // Interest filter
      if (selectedInterest !== 'all' && !role.interestTags.includes(selectedInterest)) {
        return false;
      }

      // Beginner friendly
      if (onlyBeginnerFriendly && !role.beginnerFriendly) {
        return false;
      }

      // Bookmarked filter
      if (onlyBookmarked && !bookmarkedRoleIds.includes(role.id)) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'overlap') {
        const overlapA = calculateSkillOverlap(a, userSkills);
        const overlapB = calculateSkillOverlap(b, userSkills);
        return overlapB - overlapA;
      }
      if (sortBy === 'weeks') {
        return a.estimatedWeeks.beginner - b.estimatedWeeks.beginner;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Default: match (interest + branch alignment)
      const matchA = calculateInterestMatch(a, profile.careerGoalType ? [profile.careerGoalType] : []).score;
      const matchB = calculateInterestMatch(b, profile.careerGoalType ? [profile.careerGoalType] : []).score;
      return matchB - matchA;
    });

    return result;
  }, [
    allRoles,
    searchQuery,
    selectedDomain,
    selectedBranch,
    selectedInterest,
    onlyBeginnerFriendly,
    onlyBookmarked,
    bookmarkedRoleIds,
    sortBy,
    userSkills,
    profile
  ]);

  const handleSelectRoleDetail = (role: CareerRole) => {
    setSelectedRole(role);
    setCurrentStep('role-detail');
  };

  const handleStartRoadmap = (role: CareerRole) => {
    setSelectedRole(role);
    changeTargetRole(role.id, role.title);
    setCurrentStep('path');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#222222] via-[#1a1f24] to-[#222222] rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6D1F]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6D1F]/10 border border-[#FF6D1F]/30 text-[#FF6D1F] text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Engineering Taxonomy Catalog</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FAF3E1] tracking-tight">
            Explore Engineering Roles & Career Paths
          </h1>

          <p className="text-base text-[#FAF3E1]/70 leading-relaxed">
            Discover concrete career requirements across 31+ engineering disciplines and 20+ specialized industry roles.
            Explore any role freely — your academic branch never locks you out.
          </p>

          {profile.engineeringBranch && (
            <div className="flex items-center gap-2 pt-2 text-xs text-[#FAF3E1]/60">
              <GraduationCap className="w-4 h-4 text-[#FF6D1F]" />
              <span>Current background: <strong className="text-[#FAF3E1]">{profile.engineeringBranch}</strong></span>
              <span className="text-white/20">•</span>
              <span>All roles include adaptive prerequisite mappings.</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#222222]/80 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-5 shadow-lg">
        {/* Search Bar & Primary Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#FAF3E1]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, skill (e.g. React, Docker), branch, or tool..."
              className="w-full pl-12 pr-4 py-3 bg-[#080B0D] border border-white/10 rounded-xl text-[#FAF3E1] placeholder-[#FAF3E1]/40 focus:outline-none focus:border-[#FF6D1F] focus:ring-1 focus:ring-[#FF6D1F] transition text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-xs text-[#FAF3E1]/40 hover:text-[#FAF3E1] py-1"
              >
                Clear
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs text-[#FAF3E1]/60 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort roles"
              className="w-full bg-[#080B0D] border border-white/10 rounded-xl px-3 py-3 text-sm text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F] transition"
            >
              <option value="match">Highest Recommended Match</option>
              <option value="overlap">Skill Overlap with Resume</option>
              <option value="weeks">Shortest Duration (Weeks)</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-[#FAF3E1]/60 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Domain:</span>
          </div>

          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedDomain === 'all'
                ? 'bg-[#FF6D1F] text-white shadow-sm'
                : 'bg-white/5 text-[#FAF3E1]/70 hover:bg-white/10 hover:text-[#FAF3E1]'
            }`}
          >
            All Disciplines ({allRoles.length})
          </button>

          {Object.entries(DOMAIN_LABELS).map(([domainKey, meta]) => {
            const count = allRoles.filter(r => r.domain === domainKey).length;
            if (count === 0) return null;
            return (
              <button
                key={domainKey}
                onClick={() => setSelectedDomain(domainKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedDomain === domainKey
                    ? 'bg-[#FF6D1F] text-white border-[#FF6D1F] shadow-sm'
                    : 'bg-white/5 border-white/10 text-[#FAF3E1]/70 hover:bg-white/10 hover:text-[#FAF3E1]'
                }`}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Engineering Branch Selector */}
          <div>
            <label className="block text-[11px] font-medium text-[#FAF3E1]/60 uppercase tracking-wider mb-1">
              Engineering Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              aria-label="Filter by engineering branch"
              className="w-full bg-[#080B0D] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
            >
              <option value="all">All Branches (Open Access)</option>
              {ENGINEERING_BRANCHES.map((b: any) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Interest Selector */}
          <div>
            <label className="block text-[11px] font-medium text-[#FAF3E1]/60 uppercase tracking-wider mb-1">
              Interest Focus
            </label>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              aria-label="Filter by interest focus"
              className="w-full bg-[#080B0D] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
            >
              <option value="all">All Interest Profiles</option>
              {availableInterests.map(interest => (
                <option key={interest} value={interest}>{interest}</option>
              ))}
            </select>
          </div>

          {/* Quick Toggles */}
          <div className="flex items-center gap-3 sm:col-span-2 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#FAF3E1]/80 hover:text-[#FAF3E1]">
              <input
                type="checkbox"
                checked={onlyBeginnerFriendly}
                onChange={(e) => setOnlyBeginnerFriendly(e.target.checked)}
                className="rounded border-white/20 bg-[#080B0D] text-[#FF6D1F] focus:ring-0"
              />
              <span>Beginner Friendly Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#FAF3E1]/80 hover:text-[#FAF3E1]">
              <input
                type="checkbox"
                checked={onlyBookmarked}
                onChange={(e) => setOnlyBookmarked(e.target.checked)}
                className="rounded border-white/20 bg-[#080B0D] text-[#FF6D1F] focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-[#FF6D1F]" />
                <span>Saved Bookmarks ({bookmarkedRoleIds.length})</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#FAF3E1]/60 px-1">
          <span>Showing <strong>{filteredRoles.length}</strong> engineering roles</span>
          {(selectedDomain !== 'all' || selectedBranch !== 'all' || selectedInterest !== 'all' || onlyBeginnerFriendly || onlyBookmarked || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedBranch('all');
                setSelectedInterest('all');
                setOnlyBeginnerFriendly(false);
                setOnlyBookmarked(false);
                setSearchQuery('');
              }}
              className="text-[#FF6D1F] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredRoles.length === 0 ? (
          <div className="bg-[#222222]/50 border border-white/10 rounded-2xl p-12 text-center space-y-4">
            <Layers className="w-12 h-12 text-[#FAF3E1]/30 mx-auto" />
            <h3 className="text-lg font-bold text-[#FAF3E1]">No roles matched your current filters</h3>
            <p className="text-sm text-[#FAF3E1]/60 max-w-md mx-auto">
              Try relaxing your search terms or resetting filters to explore our full taxonomy of engineering careers.
            </p>
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedBranch('all');
                setSelectedInterest('all');
                setOnlyBeginnerFriendly(false);
                setOnlyBookmarked(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#FF6D1F] text-white rounded-xl text-xs font-semibold hover:bg-[#e05d15] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoles.map(role => {
              const isBookmarked = bookmarkedRoleIds.includes(role.id);
              const overlap = calculateSkillOverlap(role, userSkills);
              const branchAligned = isBranchAligned(role, profile.engineeringBranch);
              const domainMeta = DOMAIN_LABELS[role.domain] || { label: 'Engineering', color: 'bg-white/10 text-white' };

              return (
                <div
                  key={role.id}
                  className="bg-[#222222] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF6D1F]/50 transition-all duration-200 group shadow-lg hover:shadow-2xl relative"
                >
                  <div className="space-y-4">
                    {/* Top Badges & Bookmark */}
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${domainMeta.color}`}>
                        {domainMeta.label}
                      </span>

                      <button
                        onClick={() => toggleBookmarkRole(role.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          isBookmarked
                            ? 'bg-[#FF6D1F]/20 border-[#FF6D1F] text-[#FF6D1F]'
                            : 'bg-white/5 border-white/10 text-[#FAF3E1]/40 hover:text-[#FAF3E1] hover:border-white/20'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark role'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Role Title & Summary */}
                    <div>
                      <h3 className="text-xl font-bold text-[#FAF3E1] group-hover:text-[#FF6D1F] transition line-clamp-1">
                        {role.title}
                      </h3>
                      <p className="text-xs text-[#FAF3E1]/70 mt-2 line-clamp-2 leading-relaxed">
                        {role.summary}
                      </p>
                    </div>

                    {/* Cross-Branch Guidance Notice */}
                    {!branchAligned && profile.engineeringBranch && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-tight">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>
                          Open to your background. May require foundational prerequisite preparation.
                        </span>
                      </div>
                    )}

                    {/* Overlap & Duration Meta */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-white/5">
                      <div className="flex items-center gap-1.5 text-[#FAF3E1]/70">
                        <Clock className="w-3.5 h-3.5 text-[#FAF3E1]/40" />
                        <span>~{role.estimatedWeeks.beginner} weeks roadmap</span>
                      </div>

                      {userSkills.length > 0 && (
                        <div className="flex items-center gap-1 font-medium">
                          <span className="text-[11px] text-[#FAF3E1]/50">Skill Overlap:</span>
                          <span className={`text-xs font-semibold ${overlap > 50 ? 'text-emerald-400' : 'text-[#FF6D1F]'}`}>
                            {overlap}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Key Required Skills Preview */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#FAF3E1]/50 uppercase tracking-wider">
                        Core Competencies
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.requiredSkills.slice(0, 4).map(skill => (
                          <span
                            key={skill.skillId}
                            className="px-2 py-0.5 bg-[#080B0D] border border-white/10 rounded text-[11px] text-[#FAF3E1]/80"
                          >
                            {skill.skillName}
                          </span>
                        ))}
                        {role.requiredSkills.length > 4 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-[#FAF3E1]/40">
                            +{role.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSelectRoleDetail(role)}
                      className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#FAF3E1] transition flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Role Details</span>
                    </button>

                    <button
                      onClick={() => handleStartRoadmap(role)}
                      className="px-3 py-2.5 rounded-xl bg-[#FF6D1F] hover:bg-[#e05d15] text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6D1F]/20"
                    >
                      <span>Build Path</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
