package com.ats.api.profile.service;

import com.ats.api.profile.entity.CandidateResume;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FileStorageService {
    String storeAvatar(UUID userId, MultipartFile file);
    void deleteAvatar(String avatarUrl);
    Resource loadAvatarResource(String fileName);

    CandidateResume storeResume(UUID userId, MultipartFile file);
    void deleteResume(CandidateResume resume);
    Resource loadResumeResource(CandidateResume resume);
}
