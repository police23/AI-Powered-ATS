import { httpClient } from '../../../services/httpClient';

export interface EmployerJobSummary {
  id: string;
  employerId?: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  city: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isNegotiableSalary: boolean;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
  viewsCount: number;
  applicationsCount: number;
  newApplicationsCount: number;
  expiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerJobDetail extends EmployerJobSummary {
  addressDetail?: string;
  description: string;
  requirements?: string;
  benefits?: string;
}

export interface CreateJobPayload {
  title: string;
  companyName: string;
  companyLogo?: string;
  city: string;
  addressDetail?: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isNegotiableSalary?: boolean;
  currency?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  status?: string;
  expiredAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const employerJobApi = {
  createJob: async (payload: CreateJobPayload): Promise<EmployerJobDetail> => {
    return await httpClient.post<EmployerJobDetail>('/employer/jobs', payload);
  },

  getEmployerJobs: async (
    status?: string,
    keyword?: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<EmployerJobSummary>> => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status.toUpperCase());
    if (keyword) params.append('keyword', keyword);
    params.append('page', page.toString());
    params.append('size', size.toString());

    return await httpClient.get<PageResponse<EmployerJobSummary>>(`/employer/jobs?${params.toString()}`);
  },

  getEmployerJobDetail: async (jobId: string): Promise<EmployerJobDetail> => {
    return await httpClient.get<EmployerJobDetail>(`/employer/jobs/${jobId}`);
  },

  updateJob: async (jobId: string, payload: CreateJobPayload): Promise<EmployerJobDetail> => {
    return await httpClient.put<EmployerJobDetail>(`/employer/jobs/${jobId}`, payload);
  },

  updateJobStatus: async (jobId: string, status: string): Promise<EmployerJobDetail> => {
    return await httpClient.patch<EmployerJobDetail>(`/employer/jobs/${jobId}/status`, { status });
  },

  deleteJob: async (jobId: string): Promise<void> => {
    return await httpClient.delete(`/employer/jobs/${jobId}`);
  },
};
