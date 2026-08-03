import { httpClient } from '@/services/httpClient';

export interface CandidateResumeResponse {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  mimeType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const candidateResumeApi = {
  getAllResumes: (): Promise<CandidateResumeResponse[]> => {
    return httpClient.get<CandidateResumeResponse[]>('/candidates/me/resumes');
  },

  uploadResume: (file: File, title?: string, setAsDefault?: boolean): Promise<CandidateResumeResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (setAsDefault !== undefined) formData.append('setAsDefault', String(setAsDefault));
    return httpClient.post<CandidateResumeResponse>('/candidates/me/resumes', formData);
  },

  setDefaultResume: (resumeId: string): Promise<CandidateResumeResponse> => {
    return httpClient.patch<CandidateResumeResponse>(`/candidates/me/resumes/${resumeId}/default`, {});
  },

  updateResumeTitle: (resumeId: string, title: string): Promise<CandidateResumeResponse> => {
    return httpClient.patch<CandidateResumeResponse>(`/candidates/me/resumes/${resumeId}/title`, { title });
  },

  deleteResume: (resumeId: string): Promise<{ message: string }> => {
    return httpClient.delete<{ message: string }>(`/candidates/me/resumes/${resumeId}`);
  },

  getResumeFileUrl: (resumeId: string, download = false): string => {
    return `/api/v1/candidates/me/resumes/${resumeId}/file${download ? '?download=true' : ''}`;
  }
};
