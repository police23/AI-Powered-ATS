package com.ats.api.profile.controller;

import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.security.SecurityUserPrincipal;
import com.ats.api.profile.dto.request.UpdateResumeTitleRequest;
import com.ats.api.profile.dto.response.CandidateResumeResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.service.CandidateResumeService;
import com.ats.api.profile.service.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidates/me/resumes")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateResumeController {

    private final CandidateResumeService candidateResumeService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<CandidateResumeResponse>> getAllResumes(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        List<CandidateResumeResponse> responses = candidateResumeService.getAllResumes(principal.getUserId());
        return ResponseEntity.ok(responses);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidateResumeResponse> uploadResume(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "setAsDefault", required = false, defaultValue = "false") Boolean setAsDefault
    ) {
        CandidateResumeResponse response = candidateResumeService.uploadResume(principal.getUserId(), file, title, setAsDefault);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{resumeId}/default")
    public ResponseEntity<CandidateResumeResponse> setDefaultResume(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID resumeId
    ) {
        CandidateResumeResponse response = candidateResumeService.setDefaultResume(principal.getUserId(), resumeId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{resumeId}/title")
    public ResponseEntity<CandidateResumeResponse> updateResumeTitle(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID resumeId,
            @Valid @RequestBody UpdateResumeTitleRequest request
    ) {
        CandidateResumeResponse response = candidateResumeService.updateResumeTitle(principal.getUserId(), resumeId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{resumeId}/file")
    public ResponseEntity<Resource> getResumeFile(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID resumeId,
            @RequestParam(value = "download", required = false, defaultValue = "false") boolean download
    ) {
        CandidateResume resume = candidateResumeService.getResumeFile(principal.getUserId(), resumeId);
        Resource resource = fileStorageService.loadResumeResource(resume);

        ContentDisposition disposition;
        if (download) {
            disposition = ContentDisposition.attachment()
                    .filename(resume.getFileName(), StandardCharsets.UTF_8)
                    .build();
        } else {
            disposition = ContentDisposition.inline()
                    .filename(resume.getFileName(), StandardCharsets.UTF_8)
                    .build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(resource);
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<MessageResponse> deleteResume(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @PathVariable UUID resumeId
    ) {
        candidateResumeService.deleteResume(principal.getUserId(), resumeId);
        return ResponseEntity.ok(new MessageResponse("Đã xóa tệp CV khỏi hệ thống thành công"));
    }
}
