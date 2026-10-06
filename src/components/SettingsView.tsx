import React from 'react';
import { useShift } from '../context/ShiftContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { 
  RotateCcw, 
  LogOut, 
  Briefcase, 
  Database 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { profile, resetWorkspace, setCurrentStep, activeBackendMode, aiProviderName } = useShift();

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    resetWorkspace();
    setCurrentStep('landing');
  };

  return (
    <div className="max-w-[800px] mx-auto py-12 px-6 sm:px-10">
      <div className="mb-8 pb-5 border-b border-[rgba(250,243,225,0.12)]">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
          Settings / Preferences
        </span>
        <h1 className="font-display text-4xl font-black uppercase text-[#FAF3E1] mt-1">
          Workspace Settings
        </h1>
        <p className="text-xs text-[#96928A] mt-1.5">
          Manage target role, capacity budget, AI provider, and browser persistence.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Preferences */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7">
          <h2 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-5 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#FF6D1F]" />
            Active Target Role & Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs text-[#96928A] uppercase font-bold block mb-1">Target Role</label>
              <div className="bg-[#080B0D] p-3.5 rounded-[18px] border border-[rgba(250,243,225,0.1)] text-xs text-[#FAF3E1] font-mono">
                {profile.targetRoleTitle}
              </div>
            </div>

            <div>
              <label className="text-xs text-[#96928A] uppercase font-bold block mb-1">Experience Level</label>
              <div className="bg-[#080B0D] p-3.5 rounded-[18px] border border-[rgba(250,243,225,0.1)] text-xs text-[#FAF3E1] font-mono capitalize">
                {profile.experienceLevel}
              </div>
            </div>

            <div>
              <label className="text-xs text-[#96928A] uppercase font-bold block mb-1">Weekly Hours</label>
              <div className="bg-[#080B0D] p-3.5 rounded-[18px] border border-[rgba(250,243,225,0.1)] text-xs text-[#FAF3E1] font-mono">
                {profile.weeklyHours} hrs/week
              </div>
            </div>

            <div>
              <label className="text-xs text-[#96928A] uppercase font-bold block mb-1">Sprint Duration</label>
              <div className="bg-[#080B0D] p-3.5 rounded-[18px] border border-[rgba(250,243,225,0.1)] text-xs text-[#FAF3E1] font-mono">
                {profile.durationDays} Days
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep('setup')}
            className="text-xs text-[#FF6D1F] hover:underline font-bold uppercase tracking-wider font-display cursor-pointer"
          >
            EDIT CAREER SETUP →
          </button>
        </div>

        {/* Database & Provider Status */}
        <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-7">
          <h2 className="font-display text-xl font-bold uppercase text-[#FAF3E1] mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#FF6D1F]" />
            Provider & Storage Mode
          </h2>
          <div className="space-y-3 text-xs text-[#96928A]">
            <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#080B0D] border border-[rgba(250,243,225,0.1)]">
              <span>AI Provider Mode:</span>
              <span className={`font-mono font-bold ${activeBackendMode === 'live' ? 'text-[#FF6D1F]' : 'text-[#B8D88A]'}`}>
                {activeBackendMode === 'live' ? `Live API (${aiProviderName})` : 'Offline Assistance Engine'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-[16px] bg-[#080B0D] border border-[rgba(250,243,225,0.1)]">
              <span>Supabase Status:</span>
              <span className="font-mono text-[#FAF3E1]">
                {isSupabaseConfigured ? 'Connected (Authenticated RLS)' : 'Local Storage Persistence'}
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone: Reset & Sign Out */}
        <div className="bg-[#101416] border border-[#ED6A5A]/30 rounded-[26px] p-7">
          <h2 className="font-display text-xl font-bold uppercase text-[#ED6A5A] mb-4">
            Reset & Session Actions
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                resetWorkspace();
                alert('Workspace data and LocalStorage state reset successfully.');
              }}
              className="px-6 py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#ED6A5A]/15 text-[#ED6A5A] border border-[#ED6A5A]/30 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer font-display"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Local State</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-6 py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer font-display"
            >
              <LogOut className="w-4 h-4 text-[#FF6D1F]" />
              <span>Sign Out / Return To Landing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
