package com.ats.api.profile.service.impl;

import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.profile.dto.request.UpdateProfileRequest;
import com.ats.api.profile.dto.response.ResumeResponse;
import com.ats.api.profile.dto.response.UserProfileResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.entity.Gender;
import com.ats.api.profile.entity.UserProfile;
import com.ats.api.profile.exception.FileUploadException;
import com.ats.api.profile.repository.CandidateResumeRepository;
import com.ats.api.profile.repository.UserProfileRepository;
import com.ats.api.profile.service.FileStorageService;
import com.ats.api.profile.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.text.DecimalFormat;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final CandidateResumeRepository candidateResumeRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public UserProfileResponse getProfile(UUID userId, UserRole role, String email) {
        validateNonAdmin(role);

        UserProfile profile = getOrCreateProfile(userId, email);
        return mapToResponse(profile, role, email);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UserRole role, String email, UpdateProfileRequest request) {
        validateNonAdmin(role);

        UserProfile profile = getOrCreateProfile(userId, email);
        profile.setFullName(request.getFullName().trim());
        profile.setPhoneNumber(StringUtils.hasText(request.getPhoneNumber()) ? request.getPhoneNumber().trim() : null);
        profile.setCity(StringUtils.hasText(request.getCity()) ? request.getCity().trim() : null);
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender() != null ? request.getGender() : Gender.OTHER);

        if (role == UserRole.CANDIDATE) {
            profile.setJobTitle(StringUtils.hasText(request.getJobTitle()) ? request.getJobTitle().trim() : null);
            profile.setExperienceLevel(request.getExperienceLevel());
        }

        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToResponse(savedProfile, role, email);
    }

    @Override
    @Transactional
    public String uploadAvatar(UUID userId, UserRole role, MultipartFile file) {
        validateNonAdmin(role);

        UserProfile profile = getOrCreateProfile(userId, null);
        if (StringUtils.hasText(profile.getAvatarUrl())) {
            fileStorageService.deleteAvatar(profile.getAvatarUrl());
        }

        String avatarUrl = fileStorageService.storeAvatar(userId, file);
        profile.setAvatarUrl(avatarUrl);
        userProfileRepository.save(profile);

        return avatarUrl;
    }

    @Override
    @Transactional
    public void deleteAvatar(UUID userId, UserRole role) {
        validateNonAdmin(role);

        Optional<UserProfile> profileOpt = userProfileRepository.findByUserId(userId);
        if (profileOpt.isPresent()) {
            UserProfile profile = profileOpt.get();
            if (StringUtils.hasText(profile.getAvatarUrl())) {
                fileStorageService.deleteAvatar(profile.getAvatarUrl());
                profile.setAvatarUrl(null);
                userProfileRepository.save(profile);
            }
        }
    }

    @Override
    @Transactional
    public ResumeResponse uploadResume(UUID userId, UserRole role, MultipartFile file) {
        validateCandidateOnly(role);

        Optional<CandidateResume> existingResume = candidateResumeRepository.findByUserId(userId);
        existingResume.ifPresent(fileStorageService::deleteResume);

        CandidateResume newResume = fileStorageService.storeResume(userId, file);
        if (existingResume.isPresent()) {
            CandidateResume resumeToUpdate = existingResume.get();
            resumeToUpdate.setFileName(newResume.getFileName());
            resumeToUpdate.setFilePath(newResume.getFilePath());
            resumeToUpdate.setFileSizeBytes(newResume.getFileSizeBytes());
            resumeToUpdate.setMimeType(newResume.getMimeType());
            CandidateResume saved = candidateResumeRepository.save(resumeToUpdate);
            return mapToResumeResponse(saved);
        } else {
            CandidateResume saved = candidateResumeRepository.save(newResume);
            return mapToResumeResponse(saved);
        }
    }

    @Override
    @Transactional
    public void deleteResume(UUID userId, UserRole role) {
        validateCandidateOnly(role);

        Optional<CandidateResume> resumeOpt = candidateResumeRepository.findByUserId(userId);
        if (resumeOpt.isPresent()) {
            CandidateResume resume = resumeOpt.get();
            fileStorageService.deleteResume(resume);
            candidateResumeRepository.delete(resume);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResume getResumeForDownload(UUID userId, UserRole role) {
        validateCandidateOnly(role);

        return candidateResumeRepository.findByUserId(userId)
                .orElseThrow(() -> new FileUploadException("Không tìm thấy tệp CV của ứng viên", "FILE_NOT_FOUND"));
    }

    private UserProfile getOrCreateProfile(UUID userId, String email) {
        return userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    String defaultName = "Người dùng";
                    if (StringUtils.hasText(email)) {
                        int atIndex = email.indexOf('@');
                        defaultName = atIndex > 0 ? email.substring(0, atIndex) : email;
                    }
                    UserProfile newProfile = UserProfile.builder()
                            .userId(userId)
                            .fullName(defaultName)
                            .gender(Gender.OTHER)
                            .build();
                    return userProfileRepository.save(newProfile);
                });
    }

    private UserProfileResponse mapToResponse(UserProfile profile, UserRole role, String email) {
        ResumeResponse resumeResponse = null;
        UserProfileResponse.CompanySummaryResponse companyResponse = null;

        if (role == UserRole.CANDIDATE) {
            resumeResponse = candidateResumeRepository.findByUserId(profile.getUserId())
                    .map(this::mapToResumeResponse)
                    .orElse(null);
        } else if (role == UserRole.HR || role == UserRole.HR_MANAGER) {
            companyResponse = UserProfileResponse.CompanySummaryResponse.builder()
                    .id(UUID.fromString("88888888-8888-8888-8888-888888888888"))
                    .name("ATS Partner Company")
                    .build();
        }

        return UserProfileResponse.builder()
                .userId(profile.getUserId())
                .email(email)
                .role(role != null ? role.name() : null)
                .fullName(profile.getFullName())
                .phoneNumber(profile.getPhoneNumber())
                .city(profile.getCity())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .jobTitle(role == UserRole.CANDIDATE ? profile.getJobTitle() : null)
                .experienceLevel(role == UserRole.CANDIDATE ? profile.getExperienceLevel() : null)
                .avatarUrl(profile.getAvatarUrl())
                .resume(resumeResponse)
                .company(companyResponse)
                .build();
    }

    private ResumeResponse mapToResumeResponse(CandidateResume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileSizeBytes(resume.getFileSizeBytes())
                .fileSizeFormatted(formatFileSize(resume.getFileSizeBytes()))
                .updatedAt(resume.getUpdatedAt() != null ? resume.getUpdatedAt() : resume.getCreatedAt())
                .build();
    }

    private String formatFileSize(long bytes) {
        if (bytes <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        return new DecimalFormat("#,##0.#").format(bytes / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }

    private void validateNonAdmin(UserRole role) {
        if (role == UserRole.ADMIN) {
            throw new AccessDeniedException("Tài khoản quản trị viên không sử dụng chức năng quản lý hồ sơ cá nhân");
        }
    }

    private void validateCandidateOnly(UserRole role) {
        if (role != UserRole.CANDIDATE) {
            throw new AccessDeniedException("Chỉ Ứng viên mới có thể thao tác với File CV ứng tuyển");
        }
    }
}
