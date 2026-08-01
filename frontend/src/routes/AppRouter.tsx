// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { RouteGuard } from './RouteGuard';
// import { ROLES } from '../config/access-control/roles';
// import { PERMISSIONS } from '../config/access-control/permissions';

// // Define feature components here
// const PostJob = () => <div>Post Job</div>;
// const JobBoard = () => <div>Job Board</div>;

// export const router = createBrowserRouter([
//   {
//     element: <RouteGuard />,
//     children: [
//       {
//         path: '/',
//         element: <JobBoard />,
//       },
//       {
//         path: '/jobs/create',
//         element: <PostJob />,
//         handle: {
//           requireAuth: true,
//           roles: [ROLES.EMPLOYER],
//           permissions: [PERMISSIONS.JOB_CREATE],
//         },
//       }
//     ]
//   }
// ]);

// export const AppRouter = () => {
//   return <RouterProvider router={router} />;
// };

export {};
