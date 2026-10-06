import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import type { AppStep } from '../context/ShiftContext';
import { 
  Cpu, 
  Bell, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    extractedResume,
    latestAdaptiveEvent,
    loadDemoScenario,
    activeBackendMode,
    profile,
    user,
    signOut,
    openAuthModal,
    learningTasks,
  } = useShift();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navLinks: { id: AppStep; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'roles', label: 'Explore Roles' },
    { id: 'path', label: 'My Roadmap' },
    { id: 'assessment', label: 'Skill Assessment' },
    { id: 'interview', label: 'Interview Coach' },
  ];

  // Derive candidate initials
  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : extractedResume?.candidateName
    ? extractedResume.candidateName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EN';

  const handleNavClick = (stepId: AppStep) => {
    setCurrentStep(stepId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080B0D]/90 backdrop-blur-md border-b border-[rgba(250,243,225,0.12)]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        
        {/* Left: SkillForge AI Brand & Descriptor */}
        <div 
          onClick={() => setCurrentStep('landing')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FF6D1F] p-[1.5px] shadow-lg shadow-[#FF6D1F]/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#101416] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#FF6D1F] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl tracking-tight text-[#FAF3E1]">
                SKILLFORGE <span className="text-[#FF6D1F]">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-[#96928A] hidden sm:block font-medium tracking-wide">
              Engineering Career Workspace
            </p>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#101416]/80 border border-[rgba(250,243,225,0.1)] rounded-full px-4 py-1.5 shadow-inner">
          {navLinks.map(link => {
            const isActive =
              currentStep === link.id ||
              (link.id === 'roles' && (currentStep === 'roles' || currentStep === 'role-detail' || currentStep === 'setup')) ||
              (link.id === 'assessment' && (currentStep === 'assessment' || currentStep === 'technical-assessment' || currentStep === 'behavioral-assessment'));
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer font-sans ${
                  isActive
                    ? 'bg-[#FF6D1F] text-[#222222] shadow-sm shadow-[#FF6D1F]/30 font-bold'
                    : 'text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#FAF3E1]/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Notifications & Profile Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Example Profile Loader if not set up */}
          {!extractedResume && (
            <button
              onClick={() => {
                loadDemoScenario('prd_frontend_beginner');
                setCurrentStep('dashboard');
              }}
              className="hidden md:inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1] border border-[rgba(250,243,225,0.18)] font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6D1F]" />
              <span>Explore an example profile</span>
            </button>
          )}

          {/* Engine Status Pill */}
          <div 
            title={activeBackendMode === 'live' ? 'Live AI Provider active' : 'Offline assistance engine active'}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101416] border border-[rgba(250,243,225,0.12)] text-[#96928A] text-[11px]"
          >
            <span className={`w-2 h-2 rounded-full ${activeBackendMode === 'live' ? 'bg-[#FF6D1F]' : 'bg-[#B8D88A]'}`} />
            <span>{activeBackendMode === 'live' ? 'Live AI' : 'Offline assistance'}</span>
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              title="Notifications"
              className="p-2 rounded-xl text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416] border border-transparent hover:border-[rgba(250,243,225,0.1)] transition cursor-pointer relative"
            >
              <Bell className="w-4 h-4" />
              {latestAdaptiveEvent && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6D1F] animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-[20px] p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(250,243,225,0.1)]">
                  <span className="font-display font-bold text-xs uppercase tracking-wider text-[#FAF3E1]">
                    Career Notifications
                  </span>
                  <span className="text-[10px] text-[#96928A]">System</span>
                </div>
                {latestAdaptiveEvent ? (
                  <div className="bg-[#080B0D] p-3 rounded-[14px] border border-[#FF6D1F]/30 text-xs">
                    <div className="text-[#FF6D1F] font-bold text-[11px] mb-1">Adaptive Roadmap Shift</div>
                    <p className="text-[#FAF3E1] text-[11px] leading-relaxed">{latestAdaptiveEvent.reason}</p>
                    <span className="text-[10px] text-[#96928A] mt-2 block">{latestAdaptiveEvent.timestamp}</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#96928A] py-2">No new roadmap alerts at this time.</p>
                )}
              </div>
            )}
          </div>

          {/* Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition cursor-pointer font-mono shadow-md relative ${
                user
                  ? 'bg-[#FF6D1F]/20 text-[#FAF3E1] border border-[#FF6D1F]/50 hover:bg-[#FF6D1F]/30'
                  : 'bg-[#101416] hover:bg-[#1a2024] text-[#FAF3E1]/80 border border-[rgba(250,243,225,0.18)]'
              }`}
              title={user ? `Signed in as ${user.email}` : 'Guest Workspace Profile Menu'}
              aria-label="Profile Menu"
            >
              {user ? (
                initials
              ) : (
                <User className="w-4 h-4 text-[#FAF3E1]/70" />
              )}
              {/* Online/Synced indicator */}
              <span 
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#080B0D] ${
                  user ? 'bg-[#B8D88A]' : 'bg-[#96928A]'
                }`} 
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#101416] border border-[rgba(250,243,225,0.16)] rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in duration-150">
                {user ? (
                  /* ================= AUTHENTICATED USER ================= */
                  <>
                    <div className="px-3.5 py-3 border-b border-[rgba(250,243,225,0.08)] mb-2 bg-[#080B0D]/50 rounded-xl">
                      <div className="text-xs font-bold text-[#FAF3E1] font-display">
                        {profile.fullName || user.email?.split('@')[0] || 'Candidate'}
                      </div>
                      <div className="text-[11px] text-[#96928A] truncate font-mono mt-0.5">
                        {user.email}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF6D1F]/15 text-[#FF6D1F] border border-[#FF6D1F]/30">
                          {profile.targetRoleTitle || 'Frontend Developer'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222222] text-[#FAF3E1]/70">
                          {profile.branchTitle || (profile.engineeringBranch ? profile.engineeringBranch.toUpperCase() : 'CSE')}
                        </span>
                      </div>

                      {/* Roadmap Progress */}
                      <div className="mt-3 pt-2.5 border-t border-[rgba(250,243,225,0.06)] text-[11px] font-mono text-[#FAF3E1]/70">
                        <div className="flex justify-between mb-1">
                          <span>Roadmap Progress</span>
                          <span className="text-[#FF6D1F] font-bold">
                            {learningTasks.length > 0
                              ? Math.round((learningTasks.filter(t => t.completed).length / learningTasks.length) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-[#222222] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#FF6D1F] rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                learningTasks.length > 0
                                  ? Math.round((learningTasks.filter(t => t.completed).length / learningTasks.length) * 100)
                                  : 0
                              }%`
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-[#96928A] mt-1">
                          {learningTasks.filter(t => t.completed).length} of {learningTasks.length} tasks completed
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setCurrentStep('user-profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                      >
                        <User className="w-4 h-4 text-[#FF6D1F]" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentStep('path');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                      >
                        <Sparkles className="w-4 h-4 text-[#B8D88A]" />
                        <span>My Roadmap</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentStep('assessment');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                      >
                        <Cpu className="w-4 h-4 text-[#FF6D1F]" />
                        <span>Skill Assessment</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentStep('settings');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                      >
                        <Settings className="w-4 h-4 text-[#96928A]" />
                        <span>Settings</span>
                      </button>

                      <div className="pt-1 mt-1 border-t border-[rgba(250,243,225,0.06)]">
                        <button
                          onClick={async () => {
                            await signOut();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#ED6A5A] hover:bg-[#ED6A5A]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                        >
                          <LogOut className="w-4 h-4 text-[#ED6A5A]" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ================= ANONYMOUS GUEST ================= */
                  <>
                    <div className="px-3.5 py-3 border-b border-[rgba(250,243,225,0.08)] mb-2 bg-[#080B0D]/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FAF3E1] font-display">
                          Guest workspace
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#222222] text-[#96928A]">
                          LOCAL
                        </span>
                      </div>
                      <p className="text-[11px] text-[#96928A] mt-1 font-sans leading-relaxed">
                        Create an account to keep your progress across devices.
                      </p>
                      <button
                        onClick={() => {
                          openAuthModal('signup');
                          setIsProfileMenuOpen(false);
                        }}
                        className="mt-2.5 w-full py-2 px-3 rounded-lg bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center gap-1.5"
                      >
                        <span>CREATE ACCOUNT</span>
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setCurrentStep('user-profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                      >
                        <User className="w-4 h-4 text-[#FF6D1F]" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentStep('setup');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans"
                      >
                        <Sparkles className="w-4 h-4 text-[#B8D88A]" />
                        <span>Explore Roles</span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#FAF3E1] hover:bg-[#FAF3E1]/10 flex items-center gap-2.5 transition cursor-pointer font-sans font-bold"
                      >
                        <ChevronRight className="w-4 h-4 text-[#FF6D1F]" />
                        <span>Sign in</span>
                      </button>

                      <div className="pt-1 mt-1 border-t border-[rgba(250,243,225,0.06)]">
                        <button
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-mono text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#FAF3E1]/5 transition"
                        >
                          Continue without account
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#96928A] hover:text-[#FAF3E1] hover:bg-[#101416] border border-transparent transition cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#101416] border-b border-[rgba(250,243,225,0.14)] px-6 py-5 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-[14px] text-xs font-bold font-sans flex items-center justify-between cursor-pointer ${
                currentStep === link.id
                  ? 'bg-[#FF6D1F] text-[#222222]'
                  : 'text-[#FAF3E1] hover:bg-[#FAF3E1]/5'
              }`}
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          ))}

          {!extractedResume && (
            <button
              onClick={() => {
                loadDemoScenario('prd_frontend_beginner');
                setCurrentStep('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-[14px] text-xs font-semibold text-[#FF6D1F] bg-[#FF6D1F]/10 border border-[#FF6D1F]/20 flex items-center gap-2 cursor-pointer mt-3"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore an example profile</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
