// Define fundamental user roles
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  CANDIDATE: 'candidate',
  
  // Future roles mapping
  // COMPANY_OWNER: 'company_owner',
  // HR_MANAGER: 'hr_manager',
  // RECRUITER: 'recruiter',
  // INTERVIEWER: 'interviewer',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
