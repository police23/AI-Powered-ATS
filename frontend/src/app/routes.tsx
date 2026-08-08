import { useState, useEffect } from 'react';
import { AdminDashboard } from '../features/admin-dashboard';
import { AdminUsers } from '../features/admin-users';
import { AdminCompanies } from '../features/admin-companies';
import { AdminSettings } from '../features/platform-settings';
import { AcceptInvite, Login, Register } from '../features/authentication';
import { CandidateDashboard } from '../features/candidate-dashboard';
import { ProfileSetup, CandidateResumes } from '../features/candidate-profile';
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
  | 'candidate-resumes'
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

const viewToPathMap: Record<ViewType, string> = {
  'job-board': '/',
  'public-job-search': '/search',
  'job-detail': '/job-detail',
  'candidate-job-detail': '/candidate/job-detail',
  'login': '/login',
  'register': '/register',
  'accept-invite': '/accept-invite',
  'profile-setup': '/profile-setup',
  'candidate-dashboard': '/candidate/dashboard',
  'candidate-job-search': '/candidate/search',
  'candidate-resumes': '/candidate/resumes',
  'employer-dashboard': '/employer/dashboard',
  'post-job': '/employer/post-job',
  'applicant-tracking': '/employer/applicants',
  'applied-jobs': '/candidate/applications',
  'saved-jobs': '/candidate/saved-jobs',
  'employer-jobs': '/employer/jobs',
  'interview-calendar': '/employer/calendar',
  'company-profile': '/employer/company',
  'company-users': '/employer/users',
  'candidate-settings': '/candidate/settings',
  'employer-settings': '/employer/settings',
  'email-templates': '/employer/email-templates',
  'admin-dashboard': '/admin/dashboard',
  'admin-users': '/admin/users',
  'admin-companies': '/admin/companies',
  'admin-settings': '/admin/settings',
  'public-company-profile': '/company',
  'candidate-company-profile': '/candidate/company',
};

const pathToViewMap: Record<string, ViewType> = Object.entries(viewToPathMap).reduce(
  (acc, [view, path]) => ({ ...acc, [path]: view as ViewType }),
  {} as Record<string, ViewType>
);

export default function AppRoutes() {
  const { user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || localStorage.getItem('selected_job_id');
  });

  const handleJobClick = (jobId?: string, isPublic = false) => {
    if (jobId) {
      setSelectedJobId(jobId);
      localStorage.setItem('selected_job_id', jobId);
    }
    const targetView = isPublic ? 'job-detail' : 'candidate-job-detail';
    navigateToView(targetView, jobId);
  };

  const getViewFromPath = (): ViewType | null => {
    const pathname = window.location.pathname;
    if (pathToViewMap[pathname]) {
      return pathToViewMap[pathname];
    }
    return null;
  };

  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const pathname = window.location.pathname;
    const pathView = getViewFromPath();
    const savedUser = localStorage.getItem('ats_user_profile');

    // If reloading on '/' root path and user is logged in, restore user's role dashboard
    if (pathname === '/' && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'ADMIN') return 'admin-dashboard';
        if (parsed.role === 'HR' || parsed.role === 'HR_MANAGER') return 'employer-dashboard';
        if (parsed.role === 'CANDIDATE') return 'candidate-dashboard';
      } catch {
        // Fallback
      }
    }

    if (pathView) return pathView;

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

  const navigateToView = (newView: ViewType, jobIdParam?: string) => {
    setCurrentView(newView);
    let targetPath = viewToPathMap[newView] || '/';
    const idToUse = jobIdParam || selectedJobId || localStorage.getItem('selected_job_id');
    if ((newView === 'job-detail' || newView === 'candidate-job-detail') && idToUse) {
      targetPath = `${targetPath}?id=${encodeURIComponent(idToUse)}`;
    }
    if (window.location.pathname + window.location.search !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const targetView = pathToViewMap[pathname];
      if (targetView) {
        setCurrentView(targetView);
      }
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      if (idParam) {
        setSelectedJobId(idParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAdminNavigation = (item: string) => {
    switch (item) {
      case 'dashboard':
        navigateToView('admin-dashboard');
        break;
      case 'users':
        navigateToView('admin-users');
        break;
      case 'companies':
        navigateToView('admin-companies');
        break;
      case 'settings':
        navigateToView('admin-settings');
        break;
      case 'login':
        navigateToView('login');
        break;
    }
  };

  const handleCandidateNavigation = (item: string) => {
    switch (item) {
      case 'discover':
        navigateToView('candidate-dashboard');
        break;
      case 'settings':
        navigateToView('candidate-settings');
        break;
      case 'search':
        navigateToView('candidate-job-search');
        break;
      case 'applied':
        navigateToView('applied-jobs');
        break;
      case 'saved':
        navigateToView('saved-jobs');
        break;
      case 'candidate-profile':
      case 'resumes':
        navigateToView('candidate-resumes');
        break;
      case 'login':
        navigateToView('login');
        break;
    }
  };

  const handleEmployerNavigation = (item: string) => {
    switch (item) {
      case 'dashboard':
        navigateToView('employer-dashboard');
        break;
      case 'jobs':
        navigateToView('employer-jobs');
        break;
      case 'applicant-tracking':
        navigateToView('applicant-tracking');
        break;
      case 'interview-calendar':
        navigateToView('interview-calendar');
        break;
      case 'company-profile':
        navigateToView('company-profile');
        break;
      case 'company-users':
        navigateToView('company-users');
        break;
      case 'post-job':
        navigateToView('post-job');
        break;
      case 'settings':
        navigateToView('employer-settings');
        break;
      case 'email-templates':
        navigateToView('email-templates');
        break;
      case 'login':
        navigateToView('login');
        break;
    }
  };

  return currentView === 'job-board' ? (
    <JobBoard onLoginClick={() => navigateToView('login')} onJobClick={(jobId) => handleJobClick(jobId, true)} onSearchClick={() => navigateToView('public-job-search')} />
  ) : currentView === 'public-job-search' ? (
    <PublicJobSearch onLoginClick={() => navigateToView('login')} onJobClick={(jobId) => handleJobClick(jobId, true)} onHomeClick={() => navigateToView('job-board')} />
  ) : currentView === 'job-detail' ? (
    <JobDetail jobId={selectedJobId || undefined} onBack={() => navigateToView('job-board')} onApply={() => navigateToView('login')} onViewCompany={() => navigateToView('public-company-profile')} isPublic={true} onLoginClick={() => navigateToView('login')} onHomeClick={() => navigateToView('job-board')} />
  ) : currentView === 'login' ? (
    <Login 
      onBack={() => navigateToView('job-board')} 
      onRegisterClick={() => navigateToView('register')} 
      onAcceptInviteClick={() => navigateToView('accept-invite')}
      onLoginSuccess={(role) => navigateToView(role === 'admin' ? 'admin-dashboard' : role === 'hr' ? 'employer-dashboard' : 'candidate-dashboard')}
    />
  ) : currentView === 'accept-invite' ? (
    <AcceptInvite 
      onBack={() => navigateToView('job-board')} 
      onComplete={() => navigateToView('employer-dashboard')}
    />
  ) : currentView === 'profile-setup' ? (
    <ProfileSetup onComplete={() => navigateToView('candidate-dashboard')} />
  ) : currentView === 'candidate-dashboard' ? (
    <CandidateDashboard onNavigate={handleCandidateNavigation} onJobClick={(jobId) => handleJobClick(jobId, false)} />
  ) : currentView === 'candidate-job-search' ? (
    <CandidateJobSearch onNavigate={handleCandidateNavigation} onJobClick={(jobId) => handleJobClick(jobId, false)} />
  ) : currentView === 'candidate-resumes' ? (
    <CandidateResumes onNavigate={handleCandidateNavigation} />
  ) : currentView === 'candidate-job-detail' ? (
    <CandidateJobDetail jobId={selectedJobId || undefined} onBack={() => navigateToView('candidate-job-search')} onApply={() => navigateToView('candidate-dashboard')} onNavigate={handleCandidateNavigation} onViewCompany={() => navigateToView('candidate-company-profile')} />
  ) : currentView === 'applied-jobs' ? (
    <AppliedJobs onNavigate={handleCandidateNavigation} />
  ) : currentView === 'saved-jobs' ? (
    <SavedJobs onNavigate={handleCandidateNavigation} onJobClick={(jobId) => handleJobClick(jobId, false)} />
  ) : currentView === 'employer-dashboard' ? (
    <EmployerDashboard onCreateJobClick={() => navigateToView('post-job')} onNavigate={handleEmployerNavigation} />
  ) : currentView === 'employer-jobs' ? (
    <EmployerJobs onNavigate={handleEmployerNavigation} />
  ) : currentView === 'post-job' ? (
    <PostJob onBack={() => navigateToView('employer-jobs')} onComplete={() => navigateToView('employer-jobs')} onNavigate={handleEmployerNavigation} />
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
    <CompanyProfile isCandidateView={true} onBack={() => navigateToView('job-detail')} />
  ) : currentView === 'candidate-company-profile' ? (
    <CompanyProfile isCandidateView={true} isCandidatePortal={true} onNavigate={handleCandidateNavigation} onBack={() => navigateToView('candidate-job-detail')} />
  ) : (
    <Register 
      onBack={() => navigateToView('job-board')} 
      onLoginClick={() => navigateToView('login')} 
      onRegisterSuccess={(role) => navigateToView(role === 'hr' ? 'employer-dashboard' : 'profile-setup')} 
    />
  );
}
