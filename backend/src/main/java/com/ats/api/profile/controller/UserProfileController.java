package com.ats.api.profile.controller;

import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.security.SecurityUserPrincipal;
import com.ats.api.profile.dto.request.UpdateProfileRequest;
import com.ats.api.profile.dto.response.ResumeResponse;
import com.ats.api.profile.dto.response.UserProfileResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.service.FileStorageService;
import com.ats.api.profile.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLConnection;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        UserProfileResponse response = userProfileService.getProfile(
                principal.getUserId(),
                principal.getRole(),
                principal.getEmail()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserProfileResponse response = userProfileService.updateProfile(
                principal.getUserId(),
                principal.getRole(),
                principal.getEmail(),
                request
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestParam("file") MultipartFile file
    ) {
        String avatarUrl = userProfileService.uploadAvatar(
                principal.getUserId(),
                principal.getRole(),
                file
        );
        return ResponseEntity.ok(Map.of(
                "avatarUrl", avatarUrl,
                "message", "Tải lên ảnh đại diện thành công"
        ));
    }

    @DeleteMapping("/me/avatar")
    public ResponseEntity<MessageResponse> deleteAvatar(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        userProfileService.deleteAvatar(principal.getUserId(), principal.getRole());
        return ResponseEntity.ok(new MessageResponse("Đã xóa ảnh đại diện"));
    }

    @PostMapping("/me/resume")
    public ResponseEntity<ResumeResponse> uploadResume(
            @AuthenticationPrincipal SecurityUserPrincipal principal,
            @RequestParam("file") MultipartFile file
    ) {
        ResumeResponse response = userProfileService.uploadResume(
                principal.getUserId(),
                principal.getRole(),
                file
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/resume")
    public ResponseEntity<MessageResponse> deleteResume(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        userProfileService.deleteResume(principal.getUserId(), principal.getRole());
        return ResponseEntity.ok(new MessageResponse("Đã xóa file CV thành công"));
    }

    @GetMapping("/me/resume/file")
    public ResponseEntity<Resource> downloadResume(
            @AuthenticationPrincipal SecurityUserPrincipal principal
    ) {
        CandidateResume resume = userProfileService.getResumeForDownload(
                principal.getUserId(),
                principal.getRole()
        );
        Resource resource = fileStorageService.loadResumeResource(resume);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/avatars/{fileName:.+}")
    public ResponseEntity<Resource> getAvatarFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadAvatarResource(fileName);
        String mimeType = URLConnection.guessContentTypeFromName(fileName);
        if (mimeType == null) {
            mimeType = "image/jpeg";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                .body(resource);
    }
}
