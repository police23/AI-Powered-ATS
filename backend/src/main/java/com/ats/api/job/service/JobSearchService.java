package com.ats.api.job.service;

import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.JobSearchFilterRequest;
import com.ats.api.job.dto.response.JobDetailResponse;
import com.ats.api.job.dto.response.JobSummaryResponse;

import java.util.UUID;

public interface JobSearchService {

    PageResponse<JobSummaryResponse> searchJobs(JobSearchFilterRequest filter);

    JobDetailResponse getJobDetail(UUID jobId);
}
