import { httpClient } from '@/services/httpClient';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type ExperienceLevel =
  | 'FRESHER'
  | 'UNDER_ONE_YEAR'
  | 'ONE_TO_TWO'
  | 'TWO_TO_THREE'
  | 'THREE_TO_FIVE'
  | 'OVER_FIVE';

export interface ResumeResponse {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  updatedAt: string;
}

export interface CompanySummaryResponse {
  id: string;
  name: string;
}

export interface UserProfileResponse {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  phoneNumber?: string;
  city?: string;
  dateOfBirth?: string;
  gender?: Gender;
  jobTitle?: string;
  experienceLevel?: ExperienceLevel;
  avatarUrl?: string;
  resume?: ResumeResponse | null;
  company?: CompanySummaryResponse | null;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  city?: string;
  dateOfBirth?: string;
  gender?: Gender;
  jobTitle?: string;
  experienceLevel?: ExperienceLevel;
}

export const profileApi = {
  getProfile: (): Promise<UserProfileResponse> => {
    return httpClient.get<UserProfileResponse>('/profiles/me');
  },

  updateProfile: (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    return httpClient.put<UserProfileResponse>('/profiles/me', data);
  },

  uploadAvatar: (file: File): Promise<{ avatarUrl: string; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post<{ avatarUrl: string; message: string }>('/profiles/me/avatar', formData);
  },

  deleteAvatar: (): Promise<{ message: string }> => {
    return httpClient.delete<{ message: string }>('/profiles/me/avatar');
  },

  uploadResume: (file: File): Promise<ResumeResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post<ResumeResponse>('/profiles/me/resume', formData);
  },

  deleteResume: (): Promise<{ message: string }> => {
    return httpClient.delete<{ message: string }>('/profiles/me/resume');
  },
};
