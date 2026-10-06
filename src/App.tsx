import React from 'react';
import { ShiftProvider, useShift } from './context/ShiftContext';
import { Navbar } from './components/Navbar';
import { MetricsBar } from './components/MetricsBar';
import { HeroLanding } from './components/HeroLanding';
import { CareerSetupForm } from './components/CareerSetupForm';
import { EvidenceAnalysisView } from './components/EvidenceAnalysisView';
import { SkillGapView } from './components/SkillGapView';
import { LearningPathView } from './components/LearningPathView';
import { InterviewCoachView } from './components/InterviewCoachView';
import { InterviewFeedbackView } from './components/InterviewFeedbackView';
import { DashboardView } from './components/DashboardView';
import { AuthSignIn } from './components/AuthSignIn';
import { AuthSignUp } from './components/AuthSignUp';
import { SettingsView } from './components/SettingsView';
import { SkillSelfAssessmentView } from './components/SkillSelfAssessmentView';
import { UserProfileView } from './components/UserProfileView';
import { FirstVisitAuthModal } from './components/FirstVisitAuthModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { currentStep } = useShift();

  return (
    <main className="flex-1">
      {currentStep === 'landing' && <HeroLanding />}
      {currentStep === 'signin' && <AuthSignIn />}
      {currentStep === 'signup' && <AuthSignUp />}
      {currentStep === 'dashboard' && <DashboardView />}
      {currentStep === 'setup' && <CareerSetupForm />}
      {currentStep === 'assessment' && <SkillSelfAssessmentView />}
      {currentStep === 'analysis' && <EvidenceAnalysisView />}
      {currentStep === 'gap' && <SkillGapView />}
      {currentStep === 'path' && <LearningPathView />}
      {currentStep === 'interview' && <InterviewCoachView />}
      {currentStep === 'feedback' && <InterviewFeedbackView />}
      {currentStep === 'settings' && <SettingsView />}
      {currentStep === 'user-profile' && <UserProfileView />}
    </main>
  );
};

export function App() {
  return (
    <ShiftProvider>
      <div className="min-h-screen text-[#FAF3E1] flex flex-col font-sans selection:bg-[#FF6D1F]/30 selection:text-[#FAF3E1]">
        <Navbar />
        <MetricsBar />
        <MainContent />
        <Footer />
        <FirstVisitAuthModal />
        <AuthModal />
      </div>
    </ShiftProvider>
  );
}

export default App;
