/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AppRoutes from './routes';
import { AuthProvider } from '../providers/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
