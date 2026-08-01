// import { useMatches, Navigate, Outlet } from 'react-router-dom';
// import { useAuthStore } from '../features/authentication/store/auth.store';
// import { Role } from '../config/access-control/roles';
// import { Permission } from '../config/access-control/permissions';

export const RouteGuard = () => {
  // const { user, isAuthenticated } = useAuthStore();
  // const matches = useMatches();
  
  // // Get the current route's handle metadata
  // const currentMatch = matches[matches.length - 1];
  // const handle = currentMatch?.handle as {
  //   requireAuth?: boolean;
  //   roles?: Role[];
  //   permissions?: Permission[];
  // } | undefined;

  // // 1. Check Authentication
  // if (handle?.requireAuth && !isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // // 2. Check Roles
  // if (handle?.roles && user) {
  //   if (!handle.roles.includes(user.role)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  // // 3. Check Permissions
  // if (handle?.permissions && user) {
  //   // const hasAllPermissions = handle.permissions.every(p => user.permissions.includes(p));
  //   // if (!hasAllPermissions) return <Navigate to="/unauthorized" replace />;
  // }

  // return <Outlet />;
  return null; // skeleton
};
