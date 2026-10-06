import React, { useState, useEffect } from 'react';
import { useShift } from '../context/ShiftContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    setCurrentStep,
    loadUserProfileFromSupabase
  } = useShift();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Reset state on open/mode switch
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowForgotPassword(false);
  }, [authModalOpen, authModalMode]);

  // Handle Escape key
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const getCleanErrorMessage = (err: any): string => {
    const raw = err?.message || String(err || '');
    if (raw.includes('Invalid login credentials')) {
      return 'Incorrect email or password. Please verify your details.';
    }
    if (raw.includes('User already registered') || raw.includes('already registered')) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (raw.includes('Password should be at least')) {
      return 'Password must contain at least 6 characters.';
    }
    if (raw.includes('valid email')) {
      return 'Please enter a valid email address.';
    }
    if (raw.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    return raw || 'Authentication could not be completed. Please try again.';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      // Offline assistance mode: simulate successful guest session
      setSuccessMsg('Signed in to local session.');
      setTimeout(() => {
        closeAuthModal();
        setCurrentStep('dashboard');
      }, 500);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        await loadUserProfileFromSupabase(data.user.id);
        setSuccessMsg('Welcome back! Loading your workspace...');
        setTimeout(() => {
          closeAuthModal();
          setCurrentStep('dashboard');
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setSuccessMsg('Account registered in local workspace.');
      setTimeout(() => {
        closeAuthModal();
        setCurrentStep('dashboard');
      }, 500);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: fullName.trim() || 'Engineer',
          },
        },
      });
      if (error) throw error;

      if (data.user) {
        // Upsert default profile row
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: fullName.trim() || 'Engineer',
            full_name: fullName.trim() || 'Engineer',
            email: email.trim(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        } catch (dbErr) {
          console.warn('[Supabase] Initial profile row insert non-fatal error:', dbErr);
        }

        await loadUserProfileFromSupabase(data.user.id);
        setSuccessMsg('Account created successfully! Preparing your workspace...');
        setTimeout(() => {
          closeAuthModal();
          setCurrentStep('dashboard');
        }, 700);
      }
    } catch (err: any) {
      setErrorMsg(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email to receive a password reset link.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setSuccessMsg('Reset link simulated for local mode.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccessMsg('Password reset instructions sent. Please check your inbox.');
    } catch (err: any) {
      setErrorMsg(getCleanErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-[#080B0D] border border-[rgba(250,243,225,0.16)] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 z-10 overflow-hidden"
      >
        {/* Soft atmospheric orange glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-[#FF6D1F]/20 blur-[90px] rounded-full pointer-events-none" />

        {/* Header bar */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF6D1F] p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-[#080B0D] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#FF6D1F]" />
              </div>
            </div>
            <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#FAF3E1]">
              SkillForge AI
            </span>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-[#222222]/80 hover:bg-[#222222] border border-[rgba(250,243,225,0.1)] text-[#FAF3E1]/70 hover:text-[#FAF3E1] flex items-center justify-center transition"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch between Sign In & Create Account */}
        {!showForgotPassword && (
          <div className="relative z-10 flex p-1 rounded-2xl bg-[#222222]/60 border border-[rgba(250,243,225,0.08)] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition ${
                authModalMode === 'signin'
                  ? 'bg-[#FF6D1F] text-[#FAF3E1] shadow-md shadow-[#FF6D1F]/20'
                  : 'text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition ${
                authModalMode === 'signup'
                  ? 'bg-[#FF6D1F] text-[#FAF3E1] shadow-md shadow-[#FF6D1F]/20'
                  : 'text-[#FAF3E1]/60 hover:text-[#FAF3E1]'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>
        )}

        {/* Form Header */}
        <div className="relative z-10 mb-5">
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold font-display text-[#FAF3E1]">
            {showForgotPassword
              ? 'Reset Password'
              : authModalMode === 'signin'
              ? 'Welcome back'
              : 'Create your workspace'}
          </h2>
          <p className="text-xs text-[#FAF3E1]/60 mt-1 font-sans">
            {showForgotPassword
              ? 'Enter your email to receive recovery instructions.'
              : authModalMode === 'signin'
              ? 'Sign in to access your saved engineering roadmap and interviews.'
              : 'Sync your profile, resume evidence, and skill gaps across devices.'}
          </p>
        </div>

        {/* Error / Success alert */}
        {errorMsg && (
          <div className="relative z-10 mb-4 p-3 rounded-xl bg-[#ED6A5A]/15 border border-[#ED6A5A]/40 text-xs text-[#ED6A5A] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="relative z-10 mb-4 p-3 rounded-xl bg-[#B8D88A]/15 border border-[#B8D88A]/40 text-xs text-[#B8D88A] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {showForgotPassword ? (
          <form onSubmit={handleResetPassword} className="relative z-10 space-y-4">
            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 block mb-1.5 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#FAF3E1]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  className="w-full bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 disabled:opacity-50 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SEND RESET LINK'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-center text-xs font-mono text-[#FAF3E1]/60 hover:text-[#FAF3E1] transition pt-2"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <form 
            onSubmit={authModalMode === 'signin' ? handleSignIn : handleSignUp}
            className="relative z-10 space-y-3.5"
          >
            {authModalMode === 'signup' && (
              <div>
                <label className="text-xs font-mono text-[#FAF3E1]/80 block mb-1.5 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#FAF3E1]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 block mb-1.5 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#FAF3E1]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@domain.com"
                  className="w-full bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase">
                  Password
                </label>
                {authModalMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] font-mono text-[#FF6D1F] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#FAF3E1]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#101416] border border-[rgba(250,243,225,0.12)] rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF3E1]/40 hover:text-[#FAF3E1] transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 disabled:opacity-50 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#FF6D1F]/20 active:scale-[0.99]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{authModalMode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Anonymous continue option */}
        <div className="relative z-10 text-center mt-6 pt-4 border-t border-[rgba(250,243,225,0.06)]">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs font-mono text-[#FAF3E1]/50 hover:text-[#FAF3E1] transition"
          >
            Continue as Guest without account
          </button>
        </div>
      </div>
    </div>
  );
};
