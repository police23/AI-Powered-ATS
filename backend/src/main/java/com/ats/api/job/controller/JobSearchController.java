package com.ats.api.job.controller;

import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.JobSearchFilterRequest;
import com.ats.api.job.dto.response.JobDetailResponse;
import com.ats.api.job.dto.response.JobSummaryResponse;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.service.JobSearchService;
import com.ats.api.profile.entity.ExperienceLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobSearchController {

    private final JobSearchService jobSearchService;

    @GetMapping("/search")
    public ResponseEntity<PageResponse<JobSummaryResponse>> searchJobs(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "experienceLevel", required = false) ExperienceLevel experienceLevel,
            @RequestParam(value = "employmentType", required = false) EmploymentType employmentType,
            @RequestParam(value = "minSalary", required = false) BigDecimal minSalary,
            @RequestParam(value = "maxSalary", required = false) BigDecimal maxSalary,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "sortBy", required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortOrder", required = false, defaultValue = "desc") String sortOrder
    ) {
        JobSearchFilterRequest filter = JobSearchFilterRequest.builder()
                .keyword(keyword)
                .city(city)
                .experienceLevel(experienceLevel)
                .employmentType(employmentType)
                .minSalary(minSalary)
                .maxSalary(maxSalary)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortOrder(sortOrder)
                .build();

        PageResponse<JobSummaryResponse> response = jobSearchService.searchJobs(filter);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobDetailResponse> getJobDetail(@PathVariable UUID jobId) {
        JobDetailResponse response = jobSearchService.getJobDetail(jobId);
        return ResponseEntity.ok(response);
    }
}
