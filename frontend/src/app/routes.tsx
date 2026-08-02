import { useState, useEffect } from 'react';
import { AdminDashboard } from '../features/admin-dashboard';
import { AdminUsers } from '../features/admin-users';
import { AdminCompanies } from '../features/admin-companies';
import { AdminSettings } from '../features/platform-settings';
import { AcceptInvite, Login, Register } from '../features/authentication';
import { CandidateDashboard } from '../features/candidate-dashboard';
import { ProfileSetup } from '../features/candidate-profile';
import { ApplicantTracking, InterviewCalendar } from '../features/applicant-tracking';
import { CompanyProfile, CompanyUsers } from '../features/company-management';
import { EmailTemplates } from '../features/email-templates';
import { EmployerDashboard } from '../features/employer-dashboard';
import { AppliedJobs, SavedJobs } from '../features/candidate-applications';
import { CandidateJobSearch, JobBoard, PublicJobSearch } from '../features/job-search';
import { EmployerJobs, PostJob } from '../features/job-management';
import { JobDetail, CandidateJobDetail } from '../features/job-details';
import { Settings } from '../features/user-settings';
import { useAuth } from '../hooks/useAuth';

export type ViewType = 
  | 'job-board' 
  | 'public-job-search' 
  | 'job-detail' 
  | 'candidate-job-detail' 
  | 'login' 
  | 'register' 
  | 'accept-invite' 
  | 'profile-setup' 
  | 'candidate-dashboard' 
  | 'candidate-job-search' 
  | 'employer-dashboard' 
  | 'post-job' 
  | 'applicant-tracking' 
  | 'applied-jobs' 
  | 'saved-jobs' 
  | 'employer-jobs' 
  | 'interview-calendar' 
  | 'company-profile' 
  | 'company-users' 
  | 'candidate-settings' 
  | 'employer-settings' 
  | 'email-templates' 
  | 'admin-dashboard' 
  | 'admin-users' 
  | 'admin-companies' 
  | 'admin-settings' 
  | 'public-company-profile' 
  | 'candidate-company-profile';

export default function AppRoutes() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // If user is already authenticated on initial load, take them to their dashboard
    const savedUser = localStorage.getItem('ats_user_profile');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'ADMIN') return 'admin-dashboard';
        if (parsed.role === 'HR' || parsed.role === 'HR_MANAGER') return 'employer-dashboard';
        if (parsed.role === 'CANDIDATE') return 'candidate-dashboard';
      } catch {
        // Fallback
      }
    }
    return 'job-board';
  });

  const handleAdminNavigation = (item: string) => {
    switch (item) {
      case 'dashboard':
        setCurrentView('admin-dashboard');
        break;
      case 'users':
        setCurrentView('admin-users');
        break;
      case 'companies':
        setCurrentView('admin-companies');
        break;
      case 'settings':
        setCurrentView('admin-settings');
        break;
      case 'login':
        setCurrentView('login');
        break;
    }
  };

  const handleCandidateNavigation = (item: string) => {
    switch (item) {
      case 'discover':
        setCurrentView('candidate-dashboard');
        break;
      case 'settings':
        setCurrentView('candidate-settings');
        break;
      case 'search':
        setCurrentView('candidate-job-search');
        break;
      case 'applied':
        setCurrentView('applied-jobs');
        break;
      case 'saved':
        setCurrentView('saved-jobs');
        break;
      case 'login':
        setCurrentView('login');
        break;
    }
  };

  const handleEmployerNavigation = (item: string) => {
    switch (item) {
      case 'dashboard':
        setCurrentView('employer-dashboard');
        break;
      case 'jobs':
        setCurrentView('employer-jobs');
        break;
      case 'candidates':
        setCurrentView('applicant-tracking');
        break;
      case 'calendar':
        setCurrentView('interview-calendar');
        break;
      case 'company-profile':
        setCurrentView('company-profile');
        break;
      case 'company-users':
        setCurrentView('company-users');
        break;
      case 'post-job':
        setCurrentView('post-job');
        break;
      case 'settings':
        setCurrentView('employer-settings');
        break;
      case 'email-templates':
        setCurrentView('email-templates');
        break;
      case 'login':
        setCurrentView('login');
        break;
    }
  };

  return currentView === 'job-board' ? (
    <JobBoard onLoginClick={() => setCurrentView('login')} onJobClick={() => setCurrentView('job-detail')} onSearchClick={() => setCurrentView('public-job-search')} />
  ) : currentView === 'public-job-search' ? (
    <PublicJobSearch onLoginClick={() => setCurrentView('login')} onJobClick={() => setCurrentView('job-detail')} onHomeClick={() => setCurrentView('job-board')} />
  ) : currentView === 'job-detail' ? (
    <JobDetail onBack={() => setCurrentView('job-board')} onApply={() => setCurrentView('login')} onViewCompany={() => setCurrentView('public-company-profile')} isPublic={true} onLoginClick={() => setCurrentView('login')} onHomeClick={() => setCurrentView('job-board')} />
  ) : currentView === 'login' ? (
    <Login 
      onBack={() => setCurrentView('job-board')} 
      onRegisterClick={() => setCurrentView('register')} 
      onAcceptInviteClick={() => setCurrentView('accept-invite')}
      onLoginSuccess={(role) => setCurrentView(role === 'admin' ? 'admin-dashboard' : role === 'hr' ? 'employer-dashboard' : 'candidate-dashboard')}
    />
  ) : currentView === 'accept-invite' ? (
    <AcceptInvite 
      onBack={() => setCurrentView('job-board')} 
      onComplete={() => setCurrentView('employer-dashboard')}
    />
  ) : currentView === 'profile-setup' ? (
    <ProfileSetup onComplete={() => setCurrentView('candidate-dashboard')} />
  ) : currentView === 'candidate-dashboard' ? (
    <CandidateDashboard onNavigate={handleCandidateNavigation} onJobClick={() => setCurrentView('candidate-job-detail')} />
  ) : currentView === 'candidate-job-search' ? (
    <CandidateJobSearch onNavigate={handleCandidateNavigation} onJobClick={() => setCurrentView('candidate-job-detail')} />
  ) : currentView === 'candidate-job-detail' ? (
    <CandidateJobDetail onBack={() => setCurrentView('candidate-job-search')} onApply={() => setCurrentView('candidate-dashboard')} onNavigate={handleCandidateNavigation} onViewCompany={() => setCurrentView('candidate-company-profile')} />
  ) : currentView === 'applied-jobs' ? (
    <AppliedJobs onNavigate={handleCandidateNavigation} />
  ) : currentView === 'saved-jobs' ? (
    <SavedJobs onNavigate={handleCandidateNavigation} onJobClick={() => setCurrentView('candidate-job-detail')} />
  ) : currentView === 'employer-dashboard' ? (
    <EmployerDashboard onCreateJobClick={() => setCurrentView('post-job')} onNavigate={handleEmployerNavigation} />
  ) : currentView === 'employer-jobs' ? (
    <EmployerJobs onNavigate={handleEmployerNavigation} />
  ) : currentView === 'post-job' ? (
    <PostJob onBack={() => setCurrentView('employer-jobs')} onComplete={() => setCurrentView('employer-jobs')} onNavigate={handleEmployerNavigation} />
  ) : currentView === 'applicant-tracking' ? (
    <ApplicantTracking onNavigate={handleEmployerNavigation} />
  ) : currentView === 'interview-calendar' ? (
    <InterviewCalendar onNavigate={handleEmployerNavigation} />
  ) : currentView === 'company-profile' ? (
    <CompanyProfile onNavigate={handleEmployerNavigation} />
  ) : currentView === 'company-users' ? (
    <CompanyUsers onNavigate={handleEmployerNavigation} />
  ) : currentView === 'candidate-settings' ? (
    <Settings role="candidate" onNavigate={handleCandidateNavigation} />
  ) : currentView === 'employer-settings' ? (
    <Settings role="employer" onNavigate={handleEmployerNavigation} />
  ) : currentView === 'email-templates' ? (
    <EmailTemplates onNavigate={handleEmployerNavigation} />
  ) : currentView === 'admin-dashboard' ? (
    <AdminDashboard onNavigate={handleAdminNavigation} />
  ) : currentView === 'admin-users' ? (
    <AdminUsers onNavigate={handleAdminNavigation} />
  ) : currentView === 'admin-companies' ? (
    <AdminCompanies onNavigate={handleAdminNavigation} />
  ) : currentView === 'admin-settings' ? (
    <AdminSettings onNavigate={handleAdminNavigation} />
  ) : currentView === 'public-company-profile' ? (
    <CompanyProfile isCandidateView={true} onBack={() => setCurrentView('job-detail')} />
  ) : currentView === 'candidate-company-profile' ? (
    <CompanyProfile isCandidateView={true} isCandidatePortal={true} onNavigate={handleCandidateNavigation} onBack={() => setCurrentView('candidate-job-detail')} />
  ) : (
    <Register 
      onBack={() => setCurrentView('job-board')} 
      onLoginClick={() => setCurrentView('login')} 
      onRegisterSuccess={(role) => setCurrentView(role === 'hr' ? 'employer-dashboard' : 'profile-setup')} 
    />
  );
}
