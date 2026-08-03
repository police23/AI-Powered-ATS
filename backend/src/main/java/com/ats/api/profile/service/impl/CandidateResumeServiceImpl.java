package com.ats.api.profile.service.impl;

import com.ats.api.profile.dto.request.UpdateResumeTitleRequest;
import com.ats.api.profile.dto.response.CandidateResumeResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.exception.FileUploadException;
import com.ats.api.profile.repository.CandidateResumeRepository;
import com.ats.api.profile.service.CandidateResumeService;
import com.ats.api.profile.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateResumeServiceImpl implements CandidateResumeService {

    private final CandidateResumeRepository candidateResumeRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public List<CandidateResumeResponse> getAllResumes(UUID userId) {
        return candidateResumeRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CandidateResumeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CandidateResumeResponse uploadResume(UUID userId, MultipartFile file, String title, Boolean setAsDefault) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Vui lòng chọn tệp CV định dạng PDF để tải lên", "INVALID_FILE");
        }

        String finalTitle = StringUtils.hasText(title) ? title.trim() : "CV Ứng tuyển";
        long existingCount = candidateResumeRepository.countByUserId(userId);
        boolean shouldBeDefault = Boolean.TRUE.equals(setAsDefault) || existingCount == 0;

        if (shouldBeDefault) {
            candidateResumeRepository.clearDefaultResumesByUserId(userId);
        }

        CandidateResume storedResume = fileStorageService.storeResume(userId, file);
        storedResume.setTitle(finalTitle);
        storedResume.setDefault(shouldBeDefault);

        CandidateResume saved = candidateResumeRepository.save(storedResume);
        log.info("Đã tải lên CV mới id={} cho candidate userId={}, default={}", saved.getId(), userId, saved.isDefault());
        return CandidateResumeResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CandidateResumeResponse setDefaultResume(UUID userId, UUID resumeId) {
        CandidateResume resume = candidateResumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new FileUploadException("Không tìm thấy tệp CV yêu cầu", "RESUME_NOT_FOUND"));

        if (!resume.isDefault()) {
            candidateResumeRepository.clearDefaultResumesByUserId(userId);
            resume.setDefault(true);
            resume = candidateResumeRepository.save(resume);
            log.info("Đã đặt CV id={} làm CV mặc định cho userId={}", resumeId, userId);
        }

        return CandidateResumeResponse.fromEntity(resume);
    }

    @Override
    @Transactional
    public CandidateResumeResponse updateResumeTitle(UUID userId, UUID resumeId, UpdateResumeTitleRequest request) {
        CandidateResume resume = candidateResumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new FileUploadException("Không tìm thấy tệp CV yêu cầu", "RESUME_NOT_FOUND"));

        resume.setTitle(request.getTitle().trim());
        CandidateResume updated = candidateResumeRepository.save(resume);
        log.info("Đã đổi tên CV id={} thành '{}' cho userId={}", resumeId, updated.getTitle(), userId);
        return CandidateResumeResponse.fromEntity(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResume getResumeFile(UUID userId, UUID resumeId) {
        return candidateResumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new FileUploadException("Không tìm thấy tệp CV yêu cầu", "RESUME_NOT_FOUND"));
    }

    @Override
    @Transactional
    public void deleteResume(UUID userId, UUID resumeId) {
        CandidateResume resume = candidateResumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new FileUploadException("Không tìm thấy tệp CV yêu cầu", "RESUME_NOT_FOUND"));

        boolean wasDefault = resume.isDefault();
        fileStorageService.deleteResume(resume);
        candidateResumeRepository.delete(resume);
        log.info("Đã xóa tệp CV id={} của userId={}", resumeId, userId);

        // If the deleted resume was default, assign the newest remaining resume as default
        if (wasDefault) {
            Optional<CandidateResume> newestOpt = candidateResumeRepository.findFirstByUserIdOrderByCreatedAtDesc(userId);
            newestOpt.ifPresent(newest -> {
                newest.setDefault(true);
                candidateResumeRepository.save(newest);
                log.info("Đã tự động gán CV id={} làm CV mặc định mới cho userId={}", newest.getId(), userId);
            });
        }
    }
}
