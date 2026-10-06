import React from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  Cpu, 
  Search, 
  Calendar, 
  Zap, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  BarChart3
} from 'lucide-react';
import { DEMO_PRESETS } from '../data/demoProfiles';

export const HeroLanding: React.FC = () => {
  const { setCurrentStep, loadDemoScenario } = useShift();

  return (
    <div className="relative overflow-hidden py-12 md:py-20 px-6 sm:px-10 max-w-[1280px] mx-auto">
      {/* Background Soft Orange & Cream Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-[#FF6D1F]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-[#FAF3E1]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Brand Tagline Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#101416] border border-[rgba(250,243,225,0.14)] text-xs text-[#FAF3E1] shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF6D1F] animate-pulse" />
            <span className="font-mono tracking-wider font-bold text-[#FF6D1F]">SKILLFORGE AI</span>
            <span className="text-[#96928A]">|</span>
            <span className="text-[#96928A] font-medium">Your Engineering Career Workspace</span>
          </div>
        </div>

        {/* Hero Editorial Headlines */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#FAF3E1] leading-[1.02] mb-4">
            YOUR ENGINEERING DEGREE <br className="hidden sm:block" />
            IS THE STARTING POINT.
          </h1>
          <p className="font-display text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wide text-[#FF6D1F] mb-6">
            BUILD THE SKILLS YOUR NEXT ROLE ACTUALLY NEEDS.
          </p>
          <p className="text-sm sm:text-base text-[#96928A] leading-relaxed max-w-2xl mx-auto font-sans">
            SkillForge AI connects your engineering background, resume evidence, target role, and available time to create a realistic roadmap for becoming industry-ready.
          </p>
        </div>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setCurrentStep('setup')}
            className="w-full sm:w-auto px-9 py-4 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#222222] font-black text-xs uppercase tracking-wider shadow-xl shadow-[#FF6D1F]/25 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            <span>CREATE MY CAREER PATH</span>
            <ArrowRight className="w-4 h-4 text-[#222222]" />
          </button>

          <button
            onClick={() => setCurrentStep('roles')}
            className="w-full sm:w-auto px-8 py-4 rounded-[22px] bg-[#101416] hover:bg-[#181d20] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            <span>EXPLORE ENGINEERING ROLES</span>
          </button>
        </div>

        {/* SaaS Live Workspace Preview */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[28px] p-6 sm:p-8 mb-20 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[rgba(250,243,225,0.1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-[#FF6D1F]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#FF6D1F] font-bold">
                  Active Career Roadmap Preview
                </div>
                <div className="font-display font-bold text-lg sm:text-xl text-[#FAF3E1]">
                  Target Role: Full-Stack Systems Engineer
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#080B0D] border border-[rgba(250,243,225,0.14)] text-[#96928A] font-mono text-[11px]">
                Availability: 6 hrs/week
              </span>
              <span className="px-3 py-1 rounded-full bg-[#B8D88A]/15 border border-[#B8D88A]/30 text-[#B8D88A] font-mono text-[11px] font-bold">
                14-Day Sprint Active
              </span>
            </div>
          </div>

          {/* 4 Preview Pillars Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* 1. Skills Matched */}
            <div className="bg-[#080B0D] p-4 rounded-[20px] border border-[rgba(250,243,225,0.1)]">
              <div className="flex items-center justify-between text-[11px] text-[#96928A] font-bold uppercase mb-2">
                <span>Skills Matched</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B8D88A]" />
              </div>
              <div className="font-display text-2xl font-black text-[#FAF3E1]">4 Verified</div>
              <p className="text-[11px] text-[#96928A] mt-1">HTML5, CSS3 Grid, Modern JS, Client Storage</p>
            </div>

            {/* 2. Skill Gaps */}
            <div className="bg-[#080B0D] p-4 rounded-[20px] border border-[rgba(250,243,225,0.1)]">
              <div className="flex items-center justify-between text-[11px] text-[#96928A] font-bold uppercase mb-2">
                <span>Critical Gaps</span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#ED6A5A]" />
              </div>
              <div className="font-display text-2xl font-black text-[#ED6A5A]">2 Critical</div>
              <p className="text-[11px] text-[#96928A] mt-1">Component Architecture, Async REST APIs</p>
            </div>

            {/* 3. Roadmap Progress */}
            <div className="bg-[#080B0D] p-4 rounded-[20px] border border-[rgba(250,243,225,0.1)]">
              <div className="flex items-center justify-between text-[11px] text-[#96928A] font-bold uppercase mb-2">
                <span>Roadmap Sprint</span>
                <Calendar className="w-3.5 h-3.5 text-[#FF6D1F]" />
              </div>
              <div className="font-display text-2xl font-black text-[#FAF3E1]">Day 1 / 14</div>
              <div className="w-full bg-[#101416] h-1.5 rounded-full mt-2 overflow-hidden border border-[rgba(250,243,225,0.08)]">
                <div className="bg-[#FF6D1F] h-full w-[28%]" />
              </div>
            </div>

            {/* 4. Interview Readiness */}
            <div className="bg-[#080B0D] p-4 rounded-[20px] border border-[rgba(250,243,225,0.1)]">
              <div className="flex items-center justify-between text-[11px] text-[#96928A] font-bold uppercase mb-2">
                <span>Interview Readiness</span>
                <BarChart3 className="w-3.5 h-3.5 text-[#FF6D1F]" />
              </div>
              <div className="font-display text-2xl font-black text-[#FAF3E1]">84% Benchmark</div>
              <p className="text-[11px] text-[#96928A] mt-1">STAR Rubric & Architecture Confidence</p>
            </div>
          </div>

          {/* Quick CTA inside preview */}
          <div className="bg-[#080B0D] p-4 rounded-[20px] border border-[#FF6D1F]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#FAF3E1]">
              <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
              <span>Ready to generate your personal engineering assessment?</span>
            </div>
            <button
              onClick={() => {
                loadDemoScenario('prd_frontend_beginner');
                setCurrentStep('dashboard');
              }}
              className="text-[#FF6D1F] hover:underline font-bold text-xs uppercase tracking-wider font-display cursor-pointer"
            >
              View an example journey →
            </button>
          </div>
        </div>

        {/* Three Product Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Pillar 1: Know your current level */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 transition hover:border-[#FF6D1F]/40 shadow-xl">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-[#FF6D1F] mb-5">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF6D1F] uppercase tracking-widest">Pillar 01</span>
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-1 mb-2">
              Know Your Current Level
            </h2>
            <p className="text-xs text-[#96928A] leading-relaxed font-sans">
              Analyzes your coursework, technical builds, and verifiable resume excerpts. Accurately maps proven competencies without inflated metrics or keyword tricks.
            </p>
          </div>

          {/* Pillar 2: Understand your gaps */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 transition hover:border-[#FF6D1F]/40 shadow-xl">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-[#FF6D1F] mb-5">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF6D1F] uppercase tracking-widest">Pillar 02</span>
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-1 mb-2">
              Understand Your Gaps
            </h2>
            <p className="text-xs text-[#96928A] leading-relaxed font-sans">
              Benchmarks your verified evidence against actual engineering role criteria across Software, Data, Systems, and Core Engineering disciplines.
            </p>
          </div>

          {/* Pillar 3: Build a realistic path */}
          <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7 transition hover:border-[#FF6D1F]/40 shadow-xl">
            <div className="w-11 h-11 rounded-2xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-[#FF6D1F] mb-5">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#FF6D1F] uppercase tracking-widest">Pillar 03</span>
            <h2 className="font-display text-2xl font-bold uppercase text-[#FAF3E1] mt-1 mb-2">
              Build A Realistic Path
            </h2>
            <p className="text-xs text-[#96928A] leading-relaxed font-sans">
              Constructs a customizable, time-budgeted engineering sprint that dynamically adapts when your technical interview practice highlights a weak area.
            </p>
          </div>
        </div>

        {/* Example Journeys Selector Bar */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-[22px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#FAF3E1]">
            <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
            <span className="font-medium">Explore example journeys:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  loadDemoScenario(preset.id);
                  setCurrentStep('dashboard');
                }}
                className="text-xs px-3.5 py-1.5 rounded-full bg-[#080B0D] hover:bg-[#1d2226] text-[#FAF3E1] border border-[rgba(250,243,225,0.14)] hover:border-[#FF6D1F]/50 transition font-medium cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
