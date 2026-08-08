package com.ats.api.application.service.impl;

import com.ats.api.application.dto.request.CreateApplicationRequest;
import com.ats.api.application.dto.response.ApplicationCheckResponse;
import com.ats.api.application.dto.response.ApplicationResponse;
import com.ats.api.application.entity.JobApplication;
import com.ats.api.application.entity.enums.ApplicationStatus;
import com.ats.api.application.repository.JobApplicationRepository;
import com.ats.api.application.service.CandidateApplicationService;
import com.ats.api.auth.entity.User;
import com.ats.api.auth.repository.UserRepository;
import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.exception.ProfileException;
import com.ats.api.profile.repository.CandidateResumeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandidateApplicationServiceImpl implements CandidateApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CandidateResumeRepository resumeRepository;

    @Override
    @Transactional
    public ApplicationResponse applyForJob(UUID candidateId, CreateApplicationRequest request) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ProfileException("Không tìm thấy ứng viên", "USER_NOT_FOUND", HttpStatus.NOT_FOUND));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new JobNotFoundException("Không tìm thấy tin tuyển dụng"));

        if (job.getStatus() != JobStatus.PUBLISHED) {
            throw new ProfileException("Bài tuyển dụng này hiện không khả dụng để ứng tuyển", "JOB_NOT_PUBLISHED", HttpStatus.BAD_REQUEST);
        }

        // Check if candidate already applied
        if (applicationRepository.existsByCandidateIdAndJobId(candidateId, request.getJobId())) {
            throw new ProfileException("Bạn đã nộp hồ sơ ứng tuyển vào công việc này trước đó", "ALREADY_APPLIED", HttpStatus.BAD_REQUEST);
        }

        CandidateResume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new ProfileException("Không tìm thấy hồ sơ CV được chọn", "RESUME_NOT_FOUND", HttpStatus.NOT_FOUND));

        if (!resume.getUserId().equals(candidateId)) {
            throw new ProfileException("Bạn không có quyền sử dụng hồ sơ CV này", "FORBIDDEN_RESUME", HttpStatus.FORBIDDEN);
        }

        JobApplication application = JobApplication.builder()
                .candidate(candidate)
                .job(job)
                .resume(resume)
                .status(ApplicationStatus.APPLIED)
                .build();

        JobApplication saved = applicationRepository.save(application);
        log.info("Ứng viên userId={} đã ứng tuyển công việc jobId={}, applicationId={}", candidateId, job.getId(), saved.getId());

        return ApplicationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationCheckResponse checkApplicationStatus(UUID candidateId, UUID jobId) {
        boolean exists = applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId);
        if (!exists) {
            return ApplicationCheckResponse.builder()
                    .isApplied(false)
                    .jobId(jobId)
                    .build();
        }

        Optional<JobApplication> appOpt = applicationRepository.findByCandidateIdAndJobId(candidateId, jobId);
        return ApplicationCheckResponse.builder()
                .isApplied(true)
                .jobId(jobId)
                .applicationId(appOpt.map(JobApplication::getId).orElse(null))
                .status(appOpt.map(JobApplication::getStatus).orElse(ApplicationStatus.APPLIED))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getMyApplications(UUID candidateId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appliedAt"));
        Page<JobApplication> pageResult = applicationRepository.findByCandidateId(candidateId, pageable);

        return PageResponse.fromPage(pageResult, ApplicationResponse::fromEntity);
    }
}
