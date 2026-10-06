import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { Cpu, Lock, Mail, AlertCircle, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export const AuthSignIn: React.FC = () => {
  const { setCurrentStep, loadUserProfileFromSupabase } = useShift();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getCleanErrorMessage = (err: any): string => {
    const raw = err?.message || String(err || '');
    if (raw.includes('Invalid login credentials')) {
      return 'Incorrect email or password. Please verify your details.';
    }
    if (raw.includes('valid email')) {
      return 'Please enter a valid email address.';
    }
    if (raw.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return raw || 'Authentication failed. Please try again.';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setCurrentStep('dashboard');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        await loadUserProfileFromSupabase(data.user.id);
      }
      setCurrentStep('dashboard');
    } catch (err: any) {
      setErrorMsg(getCleanErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto py-16 px-6">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#FF6D1F] p-[1.5px] mx-auto mb-4 shadow-lg shadow-[#FF6D1F]/20">
          <div className="w-full h-full bg-[#101416] rounded-[14px] flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#FF6D1F]" />
          </div>
        </div>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6D1F]">
          SkillForge AI Workspace
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-[#FAF3E1] mt-1">
          Sign In
        </h1>
        <p className="text-xs text-[#96928A] mt-1.5 font-sans">
          Access your saved engineering roadmap, resume evidence, and interview simulations.
        </p>
      </div>

      <div className="bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[26px] p-8 shadow-2xl">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#FAF3E1] block mb-2 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#96928A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@domain.com"
                className="w-full bg-[#080B0D] border border-[rgba(250,243,225,0.14)] rounded-[18px] py-3 pl-10 pr-4 text-xs text-[#FAF3E1] placeholder:text-[#96928A]/50 focus:outline-none focus:border-[#FF6D1F] transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#FAF3E1] font-mono">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#96928A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080B0D] border border-[rgba(250,243,225,0.14)] rounded-[18px] py-3 pl-10 pr-10 text-xs text-[#FAF3E1] placeholder:text-[#96928A]/50 focus:outline-none focus:border-[#FF6D1F] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#96928A] hover:text-[#FAF3E1] transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-[#ED6A5A]/15 border border-[#ED6A5A]/50 rounded-[16px] p-3 text-xs text-[#ED6A5A] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[22px] bg-[#FF6D1F] hover:bg-[#ff7e36] text-[#FAF3E1] font-bold text-xs uppercase tracking-wider transition cursor-pointer font-mono shadow-lg shadow-[#FF6D1F]/20 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>SIGN IN →</span>}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[rgba(250,243,225,0.1)] text-center space-y-3">
          <p className="text-xs text-[#96928A]">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentStep('signup')}
              className="text-[#FF6D1F] font-bold hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </p>

          <button
            onClick={() => setCurrentStep('dashboard')}
            className="w-full py-3 rounded-[20px] bg-[#080B0D] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.14)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition font-mono"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
