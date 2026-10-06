import React, { useState } from 'react';
import { useShift } from '../context/ShiftContext';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import type { EngineeringBranchId } from '../types';
import { EngineeringPathSelector } from './EngineeringPathSelector';

export const UserProfileView: React.FC = () => {
  const { 
    profile, 
    saveUserProfile, 
    user, 
    openAuthModal, 
    setCurrentStep,
    learningTasks
  } = useShift();

  const [formData, setFormData] = useState({
    // Personal details
    fullName: profile.fullName || user?.user_metadata?.display_name || '',
    email: profile.email || user?.email || '',
    university: profile.university || 'State University Institute of Technology',
    graduationYear: profile.graduationYear || '2026',
    currentSemester: profile.currentSemester || '6th Semester (3rd Year)',

    // Engineering identity
    degree: profile.degree || 'B.Tech / B.E.',
    engineeringBranch: profile.engineeringBranch || 'cse',
    branchTitle: profile.branchTitle || 'Computer Science & Engineering',
    stream: profile.stream || 'Computer Science & Engineering',
    specialization: profile.specialization || 'Full Stack Systems & Cloud',
    targetRole: profile.targetRole || 'frontend',
    targetRoleTitle: profile.targetRoleTitle || 'Frontend Developer',

    // Learning preferences
    weeklyHours: profile.weeklyHours || 6,
    learningStyle: profile.learningStyle || 'hands_on',
    durationDays: profile.durationDays || 14,
    roadmapIntensity: profile.roadmapIntensity || 'standard',

    // Career focus
    preferredIndustry: profile.preferredIndustry || 'Developer Tools & SaaS',
    workMode: profile.workMode || 'hybrid',
    locationPreference: profile.locationPreference || 'Bangalore / Remote',
    careerGoalType: profile.careerGoalType || 'internship',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);

  const completedTasks = learningTasks.filter(t => t.completed).length;
  const totalTasks = learningTasks.length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    const updatedProfile = {
      ...profile,
      fullName: formData.fullName,
      email: formData.email,
      university: formData.university,
      graduationYear: formData.graduationYear,
      currentSemester: formData.currentSemester,
      degree: formData.degree,
      engineeringBranch: formData.engineeringBranch as EngineeringBranchId,
      stream: formData.stream,
      specialization: formData.specialization,
      targetRole: formData.targetRole as any,
      targetRoleTitle: formData.targetRoleTitle,
      weeklyHours: Number(formData.weeklyHours),
      learningStyle: formData.learningStyle as any,
      durationDays: Number(formData.durationDays) as any,
      roadmapIntensity: formData.roadmapIntensity as any,
      preferredIndustry: formData.preferredIndustry,
      workMode: formData.workMode as any,
      locationPreference: formData.locationPreference,
      careerGoalType: formData.careerGoalType as any,
    };

    const res = await saveUserProfile(updatedProfile);
    setIsSaving(false);
    setSaveStatus(res);

    // Auto-clear message after 5 seconds
    setTimeout(() => {
      setSaveStatus(null);
    }, 5000);
  };

  return (
    <div className="py-10 px-6 sm:px-10 max-w-[1280px] mx-auto">
      
      {/* Top Banner / Guest Notice */}
      {!user && (
        <div className="mb-8 p-4 rounded-2xl bg-[#FF6D1F]/10 border border-[#FF6D1F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6D1F]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#FF6D1F]" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase text-[#FF6D1F]">
                Guest Workspace
              </div>
              <p className="text-xs text-[#FAF3E1]/80 mt-0.5">
                Your profile updates are saved locally on this machine. Create an account to keep this progress across devices.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2 rounded-xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition shrink-0 self-start sm:self-auto"
          >
            CREATE ACCOUNT
          </button>
        </div>
      )}

      {/* Page Title & Profile Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[rgba(250,243,225,0.1)] mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#222222] border border-[rgba(250,243,225,0.12)] text-[#FAF3E1]/70 text-xs font-mono uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5 text-[#FF6D1F]" />
            Engineering Identity & Preferences
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#FAF3E1] tracking-tight">
            Engineer Profile
          </h1>
          <p className="text-[#FAF3E1]/70 text-sm sm:text-base mt-2 max-w-2xl font-sans">
            Customize your academic credentials, technical specializations, study intensity, and target industry goals.
          </p>
        </div>

        {/* Quick status summary badge */}
        <div className="p-4 rounded-2xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 flex items-center justify-center text-lg font-bold font-display text-[#FF6D1F]">
            {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : user ? user.email?.charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#FAF3E1] font-display">
                {formData.fullName || (user ? user.email : 'Guest Engineer')}
              </span>
              {user ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#B8D88A]/20 text-[#B8D88A] border border-[#B8D88A]/30">
                  Cloud Synced
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222222] text-[#FAF3E1]/60">
                  Local Session
                </span>
              )}
            </div>
            <div className="text-xs font-mono text-[#FAF3E1]/60 mt-0.5">
              Roadmap: <strong className="text-[#FF6D1F]">{progressPct}% completed</strong> ({completedTasks}/{totalTasks} tasks)
            </div>
          </div>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveStatus && (
        <div 
          className={`mb-8 p-4 rounded-2xl border text-xs flex items-center gap-3 transition animate-in fade-in ${
            saveStatus.success 
              ? 'bg-[#B8D88A]/10 border-[#B8D88A]/40 text-[#B8D88A]' 
              : 'bg-[#ED6A5A]/10 border-[#ED6A5A]/40 text-[#ED6A5A]'
          }`}
        >
          {saveStatus.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-sans font-medium">{saveStatus.message}</span>
        </div>
      )}

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Personal Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(250,243,225,0.08)]">
            <div className="w-9 h-9 rounded-xl bg-[#222222] flex items-center justify-center text-[#FF6D1F]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#FAF3E1]">
                1. Personal Details
              </h2>
              <p className="text-xs text-[#FAF3E1]/60 font-sans">
                Contact information and academic institution background.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="e.g. alex.chen@university.edu"
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                University or Institute
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => handleFieldChange('university', e.target.value)}
                placeholder="e.g. National Institute of Technology"
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduationYear}
                  onChange={(e) => handleFieldChange('graduationYear', e.target.value)}
                  placeholder="2026"
                  className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                  Current Term / Year
                </label>
                <input
                  type="text"
                  value={formData.currentSemester}
                  onChange={(e) => handleFieldChange('currentSemester', e.target.value)}
                  placeholder="6th Semester"
                  className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Engineering Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(250,243,225,0.08)]">
            <div className="w-9 h-9 rounded-xl bg-[#222222] flex items-center justify-center text-[#FF6D1F]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#FAF3E1]">
                2. Engineering Identity
              </h2>
              <p className="text-xs text-[#FAF3E1]/60 font-sans">
                Degree discipline, branch, specialization, and target career track.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Degree Program
              </label>
              <select
                value={formData.degree}
                onChange={(e) => handleFieldChange('degree', e.target.value)}
                className="w-full md:w-1/2 bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="B.Tech / B.E.">B.Tech / B.E. (Bachelor of Engineering)</option>
                <option value="M.Tech / M.E.">M.Tech / M.E. (Master of Engineering)</option>
                <option value="B.S. Computer Science">B.S. Computer Science / IT</option>
                <option value="BCA / MCA">BCA / MCA (Computer Applications)</option>
                <option value="Dual Degree / Integrated">Dual Degree / Integrated M.Tech</option>
                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
              </select>
            </div>

            <EngineeringPathSelector
              profile={{
                ...profile,
                engineeringBranch: formData.engineeringBranch,
                stream: formData.stream,
                specialization: formData.specialization,
                targetRole: formData.targetRole,
                targetRoleTitle: formData.targetRoleTitle,
              }}
              onChange={(up) => {
                setFormData(prev => ({
                  ...prev,
                  engineeringBranch: up.engineeringBranch || prev.engineeringBranch,
                  branchTitle: up.branchTitle || prev.branchTitle,
                  stream: up.stream || prev.stream,
                  specialization: up.specialization || prev.specialization,
                  targetRole: up.targetRole || prev.targetRole,
                  targetRoleTitle: up.targetRoleTitle || prev.targetRoleTitle,
                }));
              }}
            />
          </div>
        </div>

        {/* Section 3: Learning Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(250,243,225,0.08)]">
            <div className="w-9 h-9 rounded-xl bg-[#222222] flex items-center justify-center text-[#FF6D1F]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#FAF3E1]">
                3. Learning Preferences
              </h2>
              <p className="text-xs text-[#FAF3E1]/60 font-sans">
                Time budget, curriculum sprint length, and pedagogical style.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Hours Per Week: <strong className="text-[#FF6D1F]">{formData.weeklyHours} hrs/wk</strong>
              </label>
              <input
                type="range"
                min="4"
                max="25"
                step="2"
                value={formData.weeklyHours}
                onChange={(e) => handleFieldChange('weeklyHours', e.target.value)}
                className="w-full accent-[#FF6D1F] bg-[#222222] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#FAF3E1]/40 mt-1">
                <span>4 hrs (Casual)</span>
                <span>12 hrs (Standard)</span>
                <span>25 hrs (Bootcamp)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Sprint Goal Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFieldChange('durationDays', 7)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition ${
                    Number(formData.durationDays) === 7
                      ? 'bg-[#FF6D1F] text-[#FAF3E1] border-[#FF6D1F]'
                      : 'bg-[#101416] text-[#FAF3E1]/70 border-[rgba(250,243,225,0.1)]'
                  }`}
                >
                  7 Days Sprint
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange('durationDays', 14)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition ${
                    Number(formData.durationDays) === 14
                      ? 'bg-[#FF6D1F] text-[#FAF3E1] border-[#FF6D1F]'
                      : 'bg-[#101416] text-[#FAF3E1]/70 border-[rgba(250,243,225,0.1)]'
                  }`}
                >
                  14 Days Sprint
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Preferred Learning Style
              </label>
              <select
                value={formData.learningStyle}
                onChange={(e) => handleFieldChange('learningStyle', e.target.value)}
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="hands_on">Hands-on project building & coding exercises</option>
                <option value="deep_dive">Official documentation, specifications & architecture RFCs</option>
                <option value="video_guided">Interactive guided tutorials & walkthroughs</option>
                <option value="hybrid">Hybrid challenge-driven learning loop</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Roadmap Intensity
              </label>
              <select
                value={formData.roadmapIntensity}
                onChange={(e) => handleFieldChange('roadmapIntensity', e.target.value)}
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="standard">Standard Pacing (Balanced with College Coursework)</option>
                <option value="accelerated">Accelerated (Targeting Upcoming Placement Season)</option>
                <option value="deep_dive">Deep Dive (Comprehensive Architectural Mastery)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Career Focus */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#080B0D] border border-[rgba(250,243,225,0.12)]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(250,243,225,0.08)]">
            <div className="w-9 h-9 rounded-xl bg-[#222222] flex items-center justify-center text-[#FF6D1F]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#FAF3E1]">
                4. Career Focus & Target Placement
              </h2>
              <p className="text-xs text-[#FAF3E1]/60 font-sans">
                Desired industry domains, work arrangements, and placement timeline goals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Preferred Industry Domain
              </label>
              <select
                value={formData.preferredIndustry}
                onChange={(e) => handleFieldChange('preferredIndustry', e.target.value)}
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] focus:outline-none focus:border-[#FF6D1F]"
              >
                <option value="Developer Tools & SaaS">Developer Tools & B2B SaaS</option>
                <option value="Fintech & High-Frequency Systems">Fintech & Payments Infrastructure</option>
                <option value="Artificial Intelligence & ML">Applied AI & Machine Learning</option>
                <option value="E-Commerce & High-Scale Marketplaces">E-Commerce & High-Scale Consumer Tech</option>
                <option value="HealthTech & BioInformatics">HealthTech & BioInformatics</option>
                <option value="Robotics, IoT & Automotive">Robotics, IoT & Automotive</option>
                <option value="Open Source & Infrastructure">Open Source & Web Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Work Mode Preference
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'remote', label: 'Remote' },
                  { id: 'hybrid', label: 'Hybrid' },
                  { id: 'onsite', label: 'In-Office' },
                ].map((mode) => {
                  const isSelected = formData.workMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleFieldChange('workMode', mode.id)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-mono font-bold transition ${
                        isSelected
                          ? 'bg-[#FF6D1F] text-[#FAF3E1] border-[#FF6D1F]'
                          : 'bg-[#101416] text-[#FAF3E1]/70 border-[rgba(250,243,225,0.1)]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Location Preference
              </label>
              <input
                type="text"
                value={formData.locationPreference}
                onChange={(e) => handleFieldChange('locationPreference', e.target.value)}
                placeholder="e.g. Bangalore, Hyderabad, Pune, Remote"
                className="w-full bg-[#101416] border border-[rgba(250,243,225,0.14)] rounded-xl py-2.5 px-3.5 text-xs text-[#FAF3E1] placeholder:text-[#FAF3E1]/30 focus:outline-none focus:border-[#FF6D1F]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#FAF3E1]/80 uppercase block mb-1.5">
                Career Goal Type
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'internship', label: 'Internship' },
                  { id: 'placement', label: 'Campus Placement' },
                  { id: 'full_time', label: 'Entry-Level' },
                ].map((goal) => {
                  const isSelected = formData.careerGoalType === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => handleFieldChange('careerGoalType', goal.id)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-mono font-bold transition ${
                        isSelected
                          ? 'bg-[#FF6D1F] text-[#FAF3E1] border-[#FF6D1F]'
                          : 'bg-[#101416] text-[#FAF3E1]/70 border-[rgba(250,243,225,0.1)]'
                      }`}
                    >
                      {goal.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[rgba(250,243,225,0.1)]">
          <div className="text-xs text-[#FAF3E1]/50 font-sans">
            {user ? (
              <span className="flex items-center gap-1.5 text-[#B8D88A]">
                <ShieldCheck className="w-4 h-4" />
                Synced to cloud workspace for {user.email}
              </span>
            ) : (
              <span>Guest workspace • Create an account to keep this progress across devices.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep('dashboard')}
              className="px-5 py-3 rounded-2xl border border-[rgba(250,243,225,0.14)] bg-[#222222]/50 hover:bg-[#222222] text-[#FAF3E1] text-xs font-mono font-semibold transition"
            >
              GO TO DASHBOARD
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-[#FF6D1F] hover:bg-[#FF6D1F]/90 text-[#FAF3E1] text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-2 shadow-lg shadow-[#FF6D1F]/25 active:scale-[0.99] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'SAVING...' : 'SAVE PROFILE'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
