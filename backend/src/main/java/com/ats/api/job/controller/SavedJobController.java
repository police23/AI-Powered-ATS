package com.ats.api.job.controller;

import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.security.SecurityUserPrincipal;
import com.ats.api.job.dto.response.JobSummaryResponse;
import com.ats.api.job.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidates/me/saved-jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class SavedJobController {

    private final SavedJobService savedJobService;

    @GetMapping
    public ResponseEntity<List<JobSummaryResponse>> getSavedJobs(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        List<JobSummaryResponse> responses = savedJobService.getSavedJobs(principal.getUserId());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{jobId}")
    public ResponseEntity<MessageResponse> saveJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID jobId
    ) {
        savedJobService.saveJob(principal.getUserId(), jobId);
        return ResponseEntity.ok(new MessageResponse("Đã lưu tin tuyển dụng thành công"));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<MessageResponse> unsaveJob(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID jobId
    ) {
        savedJobService.unsaveJob(principal.getUserId(), jobId);
        return ResponseEntity.ok(new MessageResponse("Đã bỏ lưu tin tuyển dụng thành công"));
    }
}
