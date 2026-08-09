package com.ats.api.job.service.impl;

import com.ats.api.application.entity.enums.ApplicationStatus;
import com.ats.api.application.repository.JobApplicationRepository;
import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.CreateJobRequest;
import com.ats.api.job.dto.request.JobStatusUpdateRequest;
import com.ats.api.job.dto.request.UpdateJobRequest;
import com.ats.api.job.dto.response.EmployerJobDetailResponse;
import com.ats.api.job.dto.response.EmployerJobSummaryResponse;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobException;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.service.EmployerJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployerJobServiceImpl implements EmployerJobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    @Override
    @Transactional
    public EmployerJobDetailResponse createJob(UUID userId, boolean isAdmin, CreateJobRequest request) {
        validateSalaryRange(request.isNegotiableSalary(), request.getSalaryMin(), request.getSalaryMax());

        Job job = Job.builder()
                .employerId(userId)
                .title(request.getTitle())
                .companyName(request.getCompanyName())
                .companyLogo(request.getCompanyLogo())
                .city(request.getCity())
                .addressDetail(request.getAddressDetail())
                .employmentType(request.getEmploymentType())
                .experienceLevel(request.getExperienceLevel())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .isNegotiableSalary(request.isNegotiableSalary())
                .currency(StringUtils.hasText(request.getCurrency()) ? request.getCurrency() : "VND")
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.PUBLISHED)
                .expiredAt(request.getExpiredAt())
                .build();

        Job saved = jobRepository.save(job);
        log.info("Job created successfully with ID: {} by user: {}", saved.getId(), userId);

        return mapToDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployerJobSummaryResponse> getEmployerJobs(UUID userId, boolean isAdmin, String status, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobPage;

        JobStatus jobStatusFilter = null;
        if (StringUtils.hasText(status) && !"ALL".equalsIgnoreCase(status)) {
            try {
                jobStatusFilter = JobStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid status filter passed: {}", status);
            }
        }

        boolean hasKeyword = StringUtils.hasText(keyword);

        if (isAdmin) {
            if (jobStatusFilter != null && hasKeyword) {
                jobPage = jobRepository.findByEmployerIdAndStatusAndTitleContainingIgnoreCase(userId, jobStatusFilter, keyword.trim(), pageable);
            } else if (jobStatusFilter != null) {
                jobPage = jobRepository.findByEmployerIdAndStatus(userId, jobStatusFilter, pageable);
            } else if (hasKeyword) {
                jobPage = jobRepository.findByEmployerIdAndTitleContainingIgnoreCase(userId, keyword.trim(), pageable);
            } else {
                jobPage = jobRepository.findAll(pageable);
            }
        } else {
            if (jobStatusFilter != null && hasKeyword) {
                jobPage = jobRepository.findByEmployerIdAndStatusAndTitleContainingIgnoreCase(userId, jobStatusFilter, keyword.trim(), pageable);
            } else if (jobStatusFilter != null) {
                jobPage = jobRepository.findByEmployerIdAndStatus(userId, jobStatusFilter, pageable);
            } else if (hasKeyword) {
                jobPage = jobRepository.findByEmployerIdAndTitleContainingIgnoreCase(userId, keyword.trim(), pageable);
            } else {
                jobPage = jobRepository.findByEmployerId(userId, pageable);
            }
        }

        Page<EmployerJobSummaryResponse> summaryPage = jobPage.map(this::mapToSummaryResponse);
        return PageResponse.fromPage(summaryPage);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployerJobDetailResponse getEmployerJobDetail(UUID userId, boolean isAdmin, UUID jobId) {
        Job job = getJobOrThrow(jobId);
        validateOwnership(userId, isAdmin, job);
        return mapToDetailResponse(job);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobDetails", key = "#jobId")
    public EmployerJobDetailResponse updateJob(UUID userId, boolean isAdmin, UUID jobId, UpdateJobRequest request) {
        Job job = getJobOrThrow(jobId);
        validateOwnership(userId, isAdmin, job);
        validateSalaryRange(request.isNegotiableSalary(), request.getSalaryMin(), request.getSalaryMax());

        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setCompanyLogo(request.getCompanyLogo());
        job.setCity(request.getCity());
        job.setAddressDetail(request.getAddressDetail());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setNegotiableSalary(request.isNegotiableSalary());
        if (StringUtils.hasText(request.getCurrency())) {
            job.setCurrency(request.getCurrency());
        }
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }
        job.setExpiredAt(request.getExpiredAt());

        Job updated = jobRepository.save(job);
        log.info("Job ID: {} updated successfully by user: {}", jobId, userId);

        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobDetails", key = "#jobId")
    public EmployerJobDetailResponse updateJobStatus(UUID userId, boolean isAdmin, UUID jobId, JobStatusUpdateRequest request) {
        Job job = getJobOrThrow(jobId);
        validateOwnership(userId, isAdmin, job);

        job.setStatus(request.getStatus());
        Job updated = jobRepository.save(job);
        log.info("Job ID: {} status updated to {} by user: {}", jobId, request.getStatus(), userId);

        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobDetails", key = "#jobId")
    public void deleteJob(UUID userId, boolean isAdmin, UUID jobId) {
        Job job = getJobOrThrow(jobId);
        validateOwnership(userId, isAdmin, job);

        jobRepository.delete(job);
        log.info("Job ID: {} deleted by user: {}", jobId, userId);
    }

    private Job getJobOrThrow(UUID jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Không tìm thấy bài đăng tuyển dụng với ID: " + jobId));
    }

    private void validateOwnership(UUID userId, boolean isAdmin, Job job) {
        if (isAdmin) {
            return;
        }
        if (job.getEmployerId() != null && !job.getEmployerId().equals(userId)) {
            throw new JobException("Bạn không có quyền thao tác trên bài đăng tuyển dụng này", "JOB_ACCESS_DENIED", HttpStatus.FORBIDDEN);
        }
    }

    private void validateSalaryRange(boolean isNegotiable, BigDecimal min, BigDecimal max) {
        if (!isNegotiable && min != null && max != null && min.compareTo(max) > 0) {
            throw new JobException("Mức lương tối thiểu không thể lớn hơn mức lương tối đa", "INVALID_SALARY_RANGE", HttpStatus.BAD_REQUEST);
        }
    }

    private EmployerJobSummaryResponse mapToSummaryResponse(Job job) {
        long applicationsCount = applicationRepository.countByJobId(job.getId());
        long newApplicationsCount = applicationRepository.countByJobIdAndStatus(job.getId(), ApplicationStatus.APPLIED);

        return EmployerJobSummaryResponse.builder()
                .id(job.getId())
                .employerId(job.getEmployerId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .companyLogo(job.getCompanyLogo())
                .city(job.getCity())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .isNegotiableSalary(job.isNegotiableSalary())
                .currency(job.getCurrency())
                .status(job.getStatus())
                .viewsCount(job.getViewsCount())
                .applicationsCount(applicationsCount)
                .newApplicationsCount(newApplicationsCount)
                .expiredAt(job.getExpiredAt())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    private EmployerJobDetailResponse mapToDetailResponse(Job job) {
        long applicationsCount = applicationRepository.countByJobId(job.getId());

        return EmployerJobDetailResponse.builder()
                .id(job.getId())
                .employerId(job.getEmployerId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .companyLogo(job.getCompanyLogo())
                .city(job.getCity())
                .addressDetail(job.getAddressDetail())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .isNegotiableSalary(job.isNegotiableSalary())
                .currency(job.getCurrency())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .status(job.getStatus())
                .viewsCount(job.getViewsCount())
                .applicationsCount(applicationsCount)
                .expiredAt(job.getExpiredAt())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
