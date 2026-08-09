package com.ats.api.job.controller;

import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.security.SecurityUserPrincipal;
import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.CreateJobRequest;
import com.ats.api.job.dto.request.JobStatusUpdateRequest;
import com.ats.api.job.dto.request.UpdateJobRequest;
import com.ats.api.job.dto.response.EmployerJobDetailResponse;
import com.ats.api.job.dto.response.EmployerJobSummaryResponse;
import com.ats.api.job.service.EmployerJobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employer/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HR', 'HR_MANAGER', 'ADMIN')")
public class EmployerJobController {

    private final EmployerJobService employerJobService;

    @PostMapping
    public ResponseEntity<EmployerJobDetailResponse> createJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody CreateJobRequest request
    ) {
        boolean isAdmin = isAdminUser(principal);
        EmployerJobDetailResponse response = employerJobService.createJob(principal.getUserId(), isAdmin, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<EmployerJobSummaryResponse>> getEmployerJobs(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        boolean isAdmin = isAdminUser(principal);
        PageResponse<EmployerJobSummaryResponse> response = employerJobService.getEmployerJobs(principal.getUserId(), isAdmin, status, keyword, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<EmployerJobDetailResponse> getEmployerJobDetail(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID jobId
    ) {
        boolean isAdmin = isAdminUser(principal);
        EmployerJobDetailResponse response = employerJobService.getEmployerJobDetail(principal.getUserId(), isAdmin, jobId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<EmployerJobDetailResponse> updateJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID jobId,
            @Valid @RequestBody UpdateJobRequest request
    ) {
        boolean isAdmin = isAdminUser(principal);
        EmployerJobDetailResponse response = employerJobService.updateJob(principal.getUserId(), isAdmin, jobId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{jobId}/status")
    public ResponseEntity<EmployerJobDetailResponse> updateJobStatus(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID jobId,
            @Valid @RequestBody JobStatusUpdateRequest request
    ) {
        boolean isAdmin = isAdminUser(principal);
        EmployerJobDetailResponse response = employerJobService.updateJobStatus(principal.getUserId(), isAdmin, jobId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<MessageResponse> deleteJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID jobId
    ) {
        boolean isAdmin = isAdminUser(principal);
        employerJobService.deleteJob(principal.getUserId(), isAdmin, jobId);
        return ResponseEntity.ok(new MessageResponse("Đã xóa bài tuyển dụng thành công"));
    }

    private boolean isAdminUser(SecurityUserPrincipal principal) {
        return principal != null && UserRole.ADMIN.equals(principal.getRole());
    }
}
