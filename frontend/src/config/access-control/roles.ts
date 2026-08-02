// Define fundamental user roles for the ATS platform
export const ROLES = {
  CANDIDATE: 'candidate',
  HR: 'hr',
  HR_MANAGER: 'hr_manager',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
