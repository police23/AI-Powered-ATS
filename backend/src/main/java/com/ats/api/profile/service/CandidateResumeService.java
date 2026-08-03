package com.ats.api.profile.service;

import com.ats.api.profile.dto.request.UpdateResumeTitleRequest;
import com.ats.api.profile.dto.response.CandidateResumeResponse;
import com.ats.api.profile.entity.CandidateResume;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface CandidateResumeService {
    List<CandidateResumeResponse> getAllResumes(UUID userId);
    CandidateResumeResponse uploadResume(UUID userId, MultipartFile file, String title, Boolean setAsDefault);
    CandidateResumeResponse setDefaultResume(UUID userId, UUID resumeId);
    CandidateResumeResponse updateResumeTitle(UUID userId, UUID resumeId, UpdateResumeTitleRequest request);
    CandidateResume getResumeFile(UUID userId, UUID resumeId);
    void deleteResume(UUID userId, UUID resumeId);
}
