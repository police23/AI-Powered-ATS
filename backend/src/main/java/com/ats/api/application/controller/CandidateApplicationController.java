package com.ats.api.application.controller;

import com.ats.api.application.dto.request.CreateApplicationRequest;
import com.ats.api.application.dto.response.ApplicationCheckResponse;
import com.ats.api.application.dto.response.ApplicationResponse;
import com.ats.api.application.service.CandidateApplicationService;
import com.ats.api.auth.security.SecurityUserPrincipal;
import com.ats.api.common.dto.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CandidateApplicationController {

    private final CandidateApplicationService applicationService;

    @PostMapping("/applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody CreateApplicationRequest request) {
        ApplicationResponse response = applicationService.applyForJob(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/applications/check")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationCheckResponse> checkApplicationStatus(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestParam("jobId") UUID jobId) {
        ApplicationCheckResponse response = applicationService.checkApplicationStatus(principal.getUserId(), jobId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/candidates/me/applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<PageResponse<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<ApplicationResponse> response = applicationService.getMyApplications(principal.getUserId(), page, size);
        return ResponseEntity.ok(response);
    }
}
