import { httpClient } from '@/services/httpClient';

export interface JobSearchParams {
  keyword?: string;
  city?: string;
  experienceLevel?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface JobSummary {
  id: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  city: string;
  addressDetail?: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isNegotiableSalary: boolean;
  currency: string;
  viewsCount: number;
  createdAt: string;
  isSaved?: boolean;
}

export interface JobDetail extends JobSummary {
  description: string;
  requirements?: string;
  benefits?: string;
  status: string;
  expiredAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export const jobSearchApi = {
  searchJobs: async (params?: JobSearchParams): Promise<PageResponse<JobSummary>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = `/jobs/search${queryString ? `?${queryString}` : ''}`;
    return httpClient.get<PageResponse<JobSummary>>(endpoint);
  },

  getJobDetail: async (jobId: string): Promise<JobDetail> => {
    return httpClient.get<JobDetail>(`/jobs/${jobId}`);
  },

  saveJob: async (jobId: string): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(`/candidates/me/saved-jobs/${jobId}`);
  },

  unsaveJob: async (jobId: string): Promise<{ message: string }> => {
    return httpClient.delete<{ message: string }>(`/candidates/me/saved-jobs/${jobId}`);
  },

  getSavedJobs: async (): Promise<JobSummary[]> => {
    return httpClient.get<JobSummary[]>('/candidates/me/saved-jobs');
  },
};
