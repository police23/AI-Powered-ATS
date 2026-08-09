import { httpClient } from '../../../services/httpClient';

export interface CreateApplicationPayload {
  jobId: string;
  resumeId: string;
}

export interface ApplicationResponse {
  id: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  city: string;
  resumeId: string;
  resumeName: string;
  status: 'APPLIED' | 'VIEWED' | 'INTERVIEW' | 'OFFERED' | 'REJECTED';
  appliedAt: string;
  updatedAt: string;
}

export interface ApplicationCheckResponse {
  isApplied: boolean;
  jobId: string;
  applicationId?: string;
  status?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const candidateApplicationApi = {
  applyForJob: async (payload: CreateApplicationPayload): Promise<ApplicationResponse> => {
    return await httpClient.post<ApplicationResponse>('/applications', payload);
  },

  checkStatus: async (jobId: string): Promise<ApplicationCheckResponse> => {
    return await httpClient.get<ApplicationCheckResponse>(`/applications/check?jobId=${jobId}`);
  },

  getMyApplications: async (page = 0, size = 10): Promise<PageResponse<ApplicationResponse>> => {
    return await httpClient.get<PageResponse<ApplicationResponse>>(`/candidates/me/applications?page=${page}&size=${size}`);
  },

  withdrawApplication: async (applicationId: string): Promise<void> => {
    return await httpClient.delete(`/applications/${applicationId}`);
  },
};
