package com.ats.api.application.service;

import com.ats.api.application.dto.request.CreateApplicationRequest;
import com.ats.api.application.dto.response.ApplicationCheckResponse;
import com.ats.api.application.dto.response.ApplicationResponse;
import com.ats.api.common.dto.PageResponse;

import java.util.UUID;

public interface CandidateApplicationService {

    ApplicationResponse applyForJob(UUID candidateId, CreateApplicationRequest request);

    ApplicationCheckResponse checkApplicationStatus(UUID candidateId, UUID jobId);

    PageResponse<ApplicationResponse> getMyApplications(UUID candidateId, int page, int size);

    void withdrawApplication(UUID candidateId, UUID applicationId);
}
