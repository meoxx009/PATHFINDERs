import React, { useEffect } from 'react';
import { useShift } from '../context/ShiftContext';
import { X, Sparkles, LogIn, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

export const FirstVisitAuthModal: React.FC = () => {
  const { 
    firstVisitModalOpen, 
    dismissFirstVisitModal, 
    openAuthModal, 
    user 
  } = useShift();

  // Handle Escape key
  useEffect(() => {
    if (!firstVisitModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissFirstVisitModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [firstVisitModalOpen, dismissFirstVisitModal]);

  // If already authenticated or not open, do not render
  if (!firstVisitModalOpen || user) {
    return null;
  }

  const handleSignIn = () => {
    dismissFirstVisitModal();
    openAuthModal('signin');
  };

  const handleCreateAccount = () => {
    dismissFirstVisitModal();
    openAuthModal('signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={dismissFirstVisitModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-visit-title"
        className="relative w-full max-w-lg bg-[#080B0D] border border-[rgba(250,243,225,0.16)] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 z-10 overflow-hidden"
      >
        {/* Soft atmospheric orange glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#FF6D1F]/20 blur-[90px] rounded-full pointer-events-none" />

        {/* Top bar with Close button */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6D1F]/10 border border-[#FF6D1F]/30 text-[#FF6D1F] text-xs font-mono font-medium uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Engineering Workspace
          </div>
          <button
            onClick={dismissFirstVisitModal}
            className="w-8 h-8 rounded-full bg-[#222222]/80 hover:bg-[#222222] border border-[rgba(250,243,225,0.1)] text-[#FAF3E1]/70 hover:text-[#FAF3E1] flex items-center justify-center transition"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center sm:text-left mb-6">
          <h2 
            id="first-visit-title"
            className="text-2xl sm:text-3xl font-extrabold font-display text-[#FAF3E1] tracking-tight"
          >
            Build a path that fits you.
          </h2>
          <p className="text-sm sm:text-base text-[#FAF3E1]/70 mt-3 font-sans leading-relaxed">
            Save your engineering profile, resume analysis, skill assessment, roadmap, and interview progress in one workspace.
          </p>
        </div>

        {/* Value pills */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-7 text-xs font-mono text-[#FAF3E1]/80">
          <div className="p-2.5 rounded-xl bg-[#222222]/50 border border-[rgba(250,243,225,0.06)] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Cross-device sync</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#222222]/50 border border-[rgba(250,243,225,0.06)] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6D1F]" />
            <span>Interview history</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 space-y-3">
          {/* Primary: SIGN IN */}
          <button
            onClick={handleSignIn}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF6D1F]/25 active:scale-[0.99]"
          >
            <LogIn className="w-4 h-4" />
            <span>SIGN IN</span>
          </button>

          {/* Secondary: CREATE ACCOUNT */}
          <button
            onClick={handleCreateAccount}
            className="w-full py-3.5 px-5 rounded-2xl border border-[rgba(250,243,225,0.2)] bg-[#222222]/60 hover:bg-[#222222] text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#FF6D1F]" />
            <span>CREATE ACCOUNT</span>
          </button>

          {/* Tertiary: CONTINUE WITHOUT ACCOUNT */}
          <button
            onClick={dismissFirstVisitModal}
            className="w-full py-2.5 text-center text-xs font-mono text-[#FAF3E1]/50 hover:text-[#FAF3E1] transition flex items-center justify-center gap-1.5 pt-1"
          >
            <span>CONTINUE WITHOUT ACCOUNT</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom subtle note */}
        <div className="relative z-10 text-center mt-5 pt-4 border-t border-[rgba(250,243,225,0.06)] text-[11px] font-sans text-[#FAF3E1]/40">
          You can explore roles and create temporary roadmaps anonymously. Reopen authentication anytime from the top-right profile menu.
        </div>
      </div>
    </div>
  );
};
