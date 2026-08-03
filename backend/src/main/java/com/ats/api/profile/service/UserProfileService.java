package com.ats.api.profile.service;

import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.profile.dto.request.UpdateProfileRequest;
import com.ats.api.profile.dto.response.ResumeResponse;
import com.ats.api.profile.dto.response.UserProfileResponse;
import com.ats.api.profile.entity.CandidateResume;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface UserProfileService {
    UserProfileResponse getProfile(UUID userId, UserRole role, String email);
    UserProfileResponse updateProfile(UUID userId, UserRole role, String email, UpdateProfileRequest request);
    String uploadAvatar(UUID userId, UserRole role, MultipartFile file);
    void deleteAvatar(UUID userId, UserRole role);
    ResumeResponse uploadResume(UUID userId, UserRole role, MultipartFile file);
    void deleteResume(UUID userId, UserRole role);
    CandidateResume getResumeForDownload(UUID userId, UserRole role);
}
