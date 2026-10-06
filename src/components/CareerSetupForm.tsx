import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import type { ExperienceLevel, SprintDuration } from '../types';
import { DEMO_PRESETS } from '../data/demoProfiles';
import { EngineeringPathSelector } from './EngineeringPathSelector';
import { 
  Clock, 
  Calendar, 
  FileText, 
  Upload, 
  Sparkles, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export const CareerSetupForm: React.FC = () => {
  const { profile, setProfile, runAnalysis, isAnalyzing } = useShift();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setErrorMsg('Please upload a plain text (.txt or .md) resume file. Or paste text directly below.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setProfile(prev => ({ ...prev, resumeText: content }));
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const loadPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setProfile(preset.profile);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.resumeText.trim() || profile.resumeText.trim().length < 40) {
      setErrorMsg('Please enter or paste your resume text (minimum 40 characters) or select one of the pre-loaded student presets.');
      return;
    }
    setErrorMsg(null);
    await runAnalysis();
  };

  return (
    <div className="max-w-[1280px] mx-auto py-10 px-6 sm:px-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
            Engineering Career Setup
          </span>
          <span className="text-[#96928A]">•</span>
          <span className="text-xs text-[#96928A]">Discipline, Target Role & Availability</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#FAF3E1] tracking-tight">
          Configure Your Engineering Path
        </h1>
        <p className="text-sm text-[#96928A] mt-2 max-w-2xl">
          Set your engineering branch, target role, and weekly available hours. SkillForge AI creates a realistic roadmap dimensioned to your actual capacity without inflated metrics.
        </p>
      </div>

      {/* Preset Fast-Picker */}
      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6 mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FAF3E1]">
            <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
            <span>Explore example engineering profiles:</span>
          </div>
          <span className="text-[10px] text-[#96928A] font-mono uppercase tracking-wider">Instant Setup</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PRESETS.map(preset => {
            const isSelected = profile.resumeText === preset.profile.resumeText && profile.targetRole === preset.profile.targetRole;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset.id)}
                className={`text-left p-4 rounded-[20px] border text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6D1F]/15 border-[#FF6D1F] text-[#FAF3E1] shadow-lg shadow-[#FF6D1F]/10'
                    : 'bg-[#080B0D] border-[rgba(250,243,225,0.1)] text-[#96928A] hover:border-[rgba(250,243,225,0.25)] hover:text-[#FAF3E1]'
                }`}
              >
                <div className="font-bold text-sm text-[#FAF3E1] flex items-center justify-between">
                  <span>{preset.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF6D1F]" />}
                </div>
                <div className="text-[11px] text-[#96928A] mt-1.5 line-clamp-1">{preset.tagline}</div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Engineering Path Selector (Branch -> Stream -> Specialization -> Role -> Skills) */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 shadow-xl">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[rgba(250,243,225,0.08)]">
            <GraduationCap className="w-5 h-5 text-[#FF6D1F]" />
            <div>
              <h2 className="font-display text-lg font-bold uppercase text-[#FAF3E1]">
                Engineering Taxonomy & Target Role
              </h2>
              <p className="text-xs text-[#96928A] font-sans">
                Select your engineering discipline, academic stream, and specialization to dynamically calibrate your target role.
              </p>
            </div>
          </div>

          <EngineeringPathSelector
            profile={profile}
            onChange={(up) => setProfile(prev => ({ ...prev, ...up }))}
          />
        </div>

        {/* Experience Level & Sprint Duration & Weekly Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Experience Level */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
            <label className="font-display text-base font-bold uppercase text-[#FAF3E1] flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-[#FF6D1F]" />
              Experience Level
            </label>
            <div className="space-y-2">
              {[
                { id: 'beginner', label: 'Beginner / Student' },
                { id: 'intern', label: 'Intern Candidate' },
                { id: 'entry_level', label: 'Entry-Level / Junior' },
              ].map(lvl => (
                <label
                  key={lvl.id}
                  className={`flex items-center gap-3 p-3 rounded-[16px] border text-xs cursor-pointer transition ${
                    profile.experienceLevel === lvl.id
                      ? 'bg-[#FF6D1F]/15 border-[#FF6D1F] text-[#FAF3E1] font-semibold'
                      : 'bg-[#080B0D] border-[rgba(250,243,225,0.1)] text-[#96928A] hover:text-[#FAF3E1]'
                  }`}
                >
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={lvl.id}
                    checked={profile.experienceLevel === lvl.id}
                    onChange={() => setProfile(p => ({ ...p, experienceLevel: lvl.id as ExperienceLevel }))}
                    className="accent-[#FF6D1F]"
                  />
                  <span>{lvl.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Weekly Available Hours (Time-Budgeted Sprint) */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="font-display text-base font-bold uppercase text-[#FAF3E1] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6D1F]" />
                Weekly Hours
              </label>
              <span className="font-mono text-xs font-bold text-[#FF6D1F] bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 px-2.5 py-0.5 rounded-full">
                {profile.weeklyHours} hrs/wk
              </span>
            </div>
            
            <input
              type="range"
              min={3}
              max={25}
              step={1}
              value={profile.weeklyHours}
              onChange={(e) => setProfile(p => ({ ...p, weeklyHours: Number(e.target.value) }))}
              className="w-full accent-[#FF6D1F] cursor-pointer mb-3"
            />

            <div className="flex gap-2">
              {[6, 10, 15].map(hrs => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setProfile(p => ({ ...p, weeklyHours: hrs }))}
                  className={`flex-1 py-1.5 text-xs rounded-xl border font-mono transition cursor-pointer ${
                    profile.weeklyHours === hrs
                      ? 'bg-[#FF6D1F] text-[#222222] font-bold border-[#FF6D1F]'
                      : 'bg-[#080B0D] border-[rgba(250,243,225,0.1)] text-[#96928A] hover:text-[#FAF3E1]'
                  }`}
                >
                  {hrs}h/wk
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#96928A] mt-3 leading-tight">
              Tasks are budgeted to fit your real student schedule.
            </p>
          </div>

          {/* Sprint Goal Duration */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-6">
            <label className="font-display text-base font-bold uppercase text-[#FAF3E1] flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#FF6D1F]" />
              Sprint Duration
            </label>
            <div className="space-y-2">
              {[
                { days: 14 as SprintDuration, label: '14-Day Sprint (Recommended)', sub: '2 Weeks • Balanced cadence' },
                { days: 7 as SprintDuration, label: '7-Day Intensive Sprint', sub: '1 Week • Rapid interview prep' },
              ].map(opt => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setProfile(p => ({ ...p, durationDays: opt.days }))}
                  className={`w-full text-left p-3 rounded-[16px] border text-xs cursor-pointer transition ${
                    profile.durationDays === opt.days
                      ? 'bg-[#FF6D1F]/15 border-[#FF6D1F] text-[#FAF3E1]'
                      : 'bg-[#080B0D] border-[rgba(250,243,225,0.1)] text-[#96928A] hover:text-[#FAF3E1]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#FAF3E1]">{opt.label}</div>
                  <div className="text-[11px] text-[#96928A] mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
            <div className="mt-3 text-[11px] font-mono text-[#96928A] bg-[#080B0D] px-3 py-1.5 rounded-xl border border-[rgba(250,243,225,0.1)]">
              Total Budget: <span className="text-[#B8D88A] font-bold">{Math.round(profile.weeklyHours * (profile.durationDays / 7))} hrs</span>
            </div>
          </div>
        </div>

        {/* Resume Input */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="font-display text-base font-bold uppercase text-[#FAF3E1] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF6D1F]" />
              Resume Text or File Input
            </label>

            <label className="inline-flex items-center gap-1.5 text-xs text-[#FAF3E1] bg-[#080B0D] hover:bg-[#1a2024] border border-[rgba(250,243,225,0.18)] px-3.5 py-1.5 rounded-full cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Upload Plain Text (.txt)</span>
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={10}
            value={profile.resumeText}
            onChange={(e) => setProfile(p => ({ ...p, resumeText: e.target.value }))}
            placeholder="Paste your resume here (education, technical skills, projects, and work experience)..."
            className="w-full bg-[#080B0D] border border-[rgba(250,243,225,0.14)] rounded-[20px] p-5 font-mono text-xs text-[#FAF3E1] placeholder:text-[#96928A]/50 focus:outline-none focus:border-[#FF6D1F] transition resize-y"
          />

          <div className="flex items-center justify-between text-xs text-[#96928A] mt-3">
            <span>Character count: {profile.resumeText.length}</span>
            <span>Supports raw text, Markdown, and exported resume sections</span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-[#ED6A5A]/15 border border-[#ED6A5A]/50 rounded-[20px] p-4 flex items-center gap-3 text-xs text-[#ED6A5A]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button: Electric Tangerine */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-10 py-4 rounded-[26px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#FF6D1F]/25 transition flex items-center justify-center gap-2 cursor-pointer font-display disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-[#222222]/30 border-t-[#222222] rounded-full animate-spin" />
                <span>EXTRACTING EVIDENCE & BENCHMARKING...</span>
              </>
            ) : (
              <>
                <span>ANALYZE RESUME & BUILD ROADMAP →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
