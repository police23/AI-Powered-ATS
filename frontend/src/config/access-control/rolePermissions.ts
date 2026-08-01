import { ROLES, Role } from './roles';
import { PERMISSIONS, Permission } from './permissions';

// Map roles to their allowed permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.SYSTEM_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.JOB_VIEW_ALL,
  ],
  [ROLES.EMPLOYER]: [
    PERMISSIONS.JOB_CREATE,
    PERMISSIONS.JOB_UPDATE,
    PERMISSIONS.APPLICANT_VIEW,
    PERMISSIONS.APPLICANT_SHORTLIST,
    PERMISSIONS.APPLICANT_REJECT,
    PERMISSIONS.INTERVIEW_MANAGE,
  ],
  [ROLES.CANDIDATE]: [
    // Candidates usually don't have dashboard management permissions,
    // they act mostly on their own profile endpoints.
  ],
};
