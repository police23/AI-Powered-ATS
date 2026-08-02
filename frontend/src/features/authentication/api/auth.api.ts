import { httpClient } from '../../../services/httpClient';

export type UserRole = 'CANDIDATE' | 'HR' | 'HR_MANAGER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'DISABLED' | 'LOCKED';

export interface UserSummary {
  id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
}

export interface RegisterResponseData {
  id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
}

export interface TokenRefreshResponseData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface MessageResponseData {
  message: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<LoginResponseData> => {
  return await httpClient.post<LoginResponseData>('/auth/login', credentials, { skipAuth: true });
};

export const registerApi = async (payload: RegisterPayload): Promise<RegisterResponseData> => {
  return await httpClient.post<RegisterResponseData>('/auth/register', payload, { skipAuth: true });
};

export const refreshTokenApi = async (): Promise<TokenRefreshResponseData> => {
  return await httpClient.post<TokenRefreshResponseData>('/auth/refresh', {}, { skipAuth: true });
};

export const logoutApi = async (): Promise<MessageResponseData> => {
  return await httpClient.post<MessageResponseData>('/auth/logout');
};
