package com.ats.api.job.service.impl;

import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.JobSearchFilterRequest;
import com.ats.api.job.dto.response.JobDetailResponse;
import com.ats.api.job.dto.response.JobSummaryResponse;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobException;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.service.JobSearchService;
import com.ats.api.job.specification.JobSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobSearchServiceImpl implements JobSearchService {

    private final JobRepository jobRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<JobSummaryResponse> searchJobs(JobSearchFilterRequest filter) {
        if (filter == null) {
            filter = new JobSearchFilterRequest();
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String sortBy = sanitizeSortBy(filter.getSortBy());
        Pageable pageable = PageRequest.of(Math.max(0, filter.getPage()), Math.min(50, Math.max(1, filter.getSize())), Sort.by(direction, sortBy));

        Specification<Job> spec = JobSpecification.filterJobs(filter);
        Page<Job> jobPage = jobRepository.findAll(spec, pageable);

        Page<JobSummaryResponse> responsePage = jobPage.map(JobSummaryResponse::fromEntity);
        return PageResponse.fromPage(responsePage);
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.Cacheable(value = "jobDetails", key = "#jobId")
    public JobDetailResponse getJobDetail(UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Không tìm thấy bài tuyển dụng yêu cầu"));

        if (job.getStatus() != JobStatus.PUBLISHED) {
            throw new JobException("Bài tuyển dụng hiện không khả dụng", "JOB_UNAVAILABLE", HttpStatus.BAD_REQUEST);
        }

        // Increment view count
        job.setViewsCount(job.getViewsCount() + 1);
        Job saved = jobRepository.save(job);

        log.info("Khách xem chi tiết bài tuyển dụng id={}, totalViews={}", saved.getId(), saved.getViewsCount());
        return JobDetailResponse.fromEntity(saved);
    }

    private String sanitizeSortBy(String sortBy) {
        if ("salaryMax".equalsIgnoreCase(sortBy)) return "salaryMax";
        if ("viewsCount".equalsIgnoreCase(sortBy)) return "viewsCount";
        return "createdAt";
    }
}
