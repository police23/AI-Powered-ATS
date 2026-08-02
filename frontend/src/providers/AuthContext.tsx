import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  loginApi,
  registerApi,
  logoutApi,
  LoginCredentials,
  RegisterPayload,
  UserSummary,
  LoginResponseData,
  RegisterResponseData
} from '../features/authentication/api/auth.api';
import { getStoredAccessToken, setStoredAccessToken } from '../services/httpClient';

interface AuthContextType {
  user: UserSummary | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponseData>;
  register: (payload: RegisterPayload) => Promise<RegisterResponseData>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'ats_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as UserSummary;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [accessToken, setAccessTokenState] = useState<string | null>(() => getStoredAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state with storage helper
  const handleSetSession = useCallback((token: string | null, userSummary: UserSummary | null) => {
    setStoredAccessToken(token);
    setAccessTokenState(token);
    setUser(userSummary);

    if (userSummary) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userSummary));
      if (userSummary.role === 'HR' || userSummary.role === 'HR_MANAGER') {
        localStorage.setItem('isCompanyAdmin', userSummary.role === 'HR_MANAGER' ? 'true' : 'false');
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('isCompanyAdmin');
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<LoginResponseData> => {
    setIsLoading(true);
    try {
      const response = await loginApi(credentials);
      handleSetSession(response.accessToken, response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<RegisterResponseData> => {
    setIsLoading(true);
    try {
      const response = await registerApi(payload);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch {
      // Ignore network failure on logout
    } finally {
      handleSetSession(null, null);
      setIsLoading(false);
    }
  };

  // Listen for global auth expiration events from httpClient
  useEffect(() => {
    const handleAuthExpired = () => {
      handleSetSession(null, null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [handleSetSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
