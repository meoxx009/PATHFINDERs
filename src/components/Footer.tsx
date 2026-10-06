import React from 'react';
import { useShift } from '../context/ShiftContext';
import { Cpu } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

export const Footer: React.FC = () => {
  const { setCurrentStep, resetWorkspace } = useShift();

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    resetWorkspace();
    setCurrentStep('landing');
  };

  return (
    <footer className="border-t border-[rgba(250,243,225,0.12)] bg-[#080B0D] py-14 px-6 sm:px-10 mt-auto">
      <div className="max-w-[1280px] mx-auto">
        {/* Top 4 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Intro Column */}
          <div className="col-span-2 md:col-span-1">
            <div 
              onClick={() => setCurrentStep('landing')}
              className="flex items-center gap-2.5 cursor-pointer mb-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FF6D1F] p-[1.5px]">
                <div className="w-full h-full bg-[#101416] rounded-[9px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-[#FF6D1F]" />
                </div>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-[#FAF3E1]">
                SKILLFORGE <span className="text-[#FF6D1F]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#96928A] leading-relaxed">
              Build the skills your next role actually needs. The engineering career workspace for ambitious students and early-career engineers.
            </p>
          </div>

          {/* 1. Product Column */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#FAF3E1] mb-3.5">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-[#96928A]">
              <li>
                <button 
                  onClick={() => setCurrentStep('dashboard')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentStep('setup')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Role Explorer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentStep('gap')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Skill Assessment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentStep('path')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Roadmap
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentStep('interview')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Interview Coach
                </button>
              </li>
            </ul>
          </div>

          {/* 2. Engineering Paths Column */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#FAF3E1] mb-3.5">
              Engineering Paths
            </h4>
            <ul className="space-y-2.5 text-xs text-[#96928A]">
              <li className="hover:text-[#FAF3E1] transition cursor-pointer flex items-center gap-1">
                <span>Software Engineering</span>
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer flex items-center gap-1">
                <span>AI & Data Systems</span>
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer flex items-center gap-1">
                <span>Electronics & Embedded</span>
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer flex items-center gap-1">
                <span>Mechanical & Systems</span>
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer flex items-center gap-1">
                <span>Civil & Infrastructure</span>
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer flex items-center gap-1">
                <span>Core Engineering</span>
              </li>
            </ul>
          </div>

          {/* 3. Resources Column */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#FAF3E1] mb-3.5">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-[#96928A]">
              <li className="hover:text-[#FAF3E1] transition cursor-pointer">
                Resume Evidence Guide
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer">
                STAR Interview Framework
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer">
                Capacity-Budgeted Method
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer">
                Technical Skill Taxonomy
              </li>
            </ul>
          </div>

          {/* 4. Account Column */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#FAF3E1] mb-3.5">
              Account
            </h4>
            <ul className="space-y-2.5 text-xs text-[#96928A]">
              <li>
                <button 
                  onClick={() => setCurrentStep('dashboard')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Candidate Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentStep('settings')}
                  className="hover:text-[#FF6D1F] transition cursor-pointer"
                >
                  Workspace Preferences
                </button>
              </li>
              <li className="hover:text-[#FAF3E1] transition cursor-pointer">
                Privacy & Data Security
              </li>
              <li>
                <button 
                  onClick={handleSignOut}
                  className="hover:text-[#ED6A5A] transition cursor-pointer text-[#ED6A5A]/80"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-[rgba(250,243,225,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#96928A]">
          <p>
            © SkillForge AI. Built for ambitious engineering students and early-career professionals.
          </p>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span>Engineering Career Workspace</span>
            <span className="text-[#96928A]">•</span>
            <span className="text-[#B8D88A]">Adaptive Verification Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
