package com.ats.api.profile.dto.response;

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
public class ResumeResponse {
    private UUID id;
    private String fileName;
    private long fileSizeBytes;
    private String fileSizeFormatted;
    private Instant updatedAt;
}
