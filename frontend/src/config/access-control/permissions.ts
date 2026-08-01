// Define granular system permissions
export const PERMISSIONS = {
  // Jobs
  JOB_CREATE: 'job.create',
  JOB_UPDATE: 'job.update',
  JOB_DELETE: 'job.delete',
  JOB_VIEW_ALL: 'job.view.all',
  
  // Applicants
  APPLICANT_VIEW: 'applicant.view',
  APPLICANT_SHORTLIST: 'applicant.shortlist',
  APPLICANT_REJECT: 'applicant.reject',
  
  // Interviews
  INTERVIEW_MANAGE: 'interview.manage',
  INTERVIEW_VIEW: 'interview.view',
  
  // Admin
  SYSTEM_MANAGE: 'system.manage',
  USER_MANAGE: 'user.manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
