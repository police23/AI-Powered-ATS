package com.ats.api.profile.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ats.api.profile.entity.CandidateResume;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResumeResponse {

    private UUID id;
    private UUID userId;
    private String title;
    private String fileName;
    private String fileSizeFormatted;
    private long fileSizeBytes;
    private String mimeType;

    @JsonProperty("isDefault")
    private boolean isDefault;
    private Instant createdAt;
    private Instant updatedAt;

    public static CandidateResumeResponse fromEntity(CandidateResume entity) {
        if (entity == null) return null;

        long bytes = entity.getFileSizeBytes();
        String formattedSize;
        if (bytes < 1024 * 1024) {
            formattedSize = String.format("%.0f KB", bytes / 1024.0);
        } else {
            formattedSize = String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        }

        return CandidateResumeResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .title(entity.getTitle())
                .fileName(entity.getFileName())
                .fileSizeFormatted(formattedSize)
                .fileSizeBytes(entity.getFileSizeBytes())
                .mimeType(entity.getMimeType())
                .isDefault(entity.isDefault())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
