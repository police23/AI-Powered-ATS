package com.ats.api.job.service;

import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.CreateJobRequest;
import com.ats.api.job.dto.request.JobStatusUpdateRequest;
import com.ats.api.job.dto.request.UpdateJobRequest;
import com.ats.api.job.dto.response.EmployerJobDetailResponse;
import com.ats.api.job.dto.response.EmployerJobSummaryResponse;

import java.util.UUID;

public interface EmployerJobService {

    EmployerJobDetailResponse createJob(UUID userId, boolean isAdmin, CreateJobRequest request);

    PageResponse<EmployerJobSummaryResponse> getEmployerJobs(UUID userId, boolean isAdmin, String status, String keyword, int page, int size);

    EmployerJobDetailResponse getEmployerJobDetail(UUID userId, boolean isAdmin, UUID jobId);

    EmployerJobDetailResponse updateJob(UUID userId, boolean isAdmin, UUID jobId, UpdateJobRequest request);

    EmployerJobDetailResponse updateJobStatus(UUID userId, boolean isAdmin, UUID jobId, JobStatusUpdateRequest request);

    void deleteJob(UUID userId, boolean isAdmin, UUID jobId);
}
