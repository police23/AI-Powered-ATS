package com.ats.api.job.service;

import com.ats.api.job.dto.response.JobSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface SavedJobService {

    void saveJob(UUID userId, UUID jobId);

    void unsaveJob(UUID userId, UUID jobId);

    List<JobSummaryResponse> getSavedJobs(UUID userId);
}
