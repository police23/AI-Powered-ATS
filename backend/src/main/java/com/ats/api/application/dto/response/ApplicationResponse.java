package com.ats.api.application.dto.response;

import com.ats.api.application.entity.JobApplication;
import com.ats.api.application.entity.enums.ApplicationStatus;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private UUID id;
    private UUID candidateId;
    private UUID jobId;
    private String jobTitle;
    private String companyName;
    private String companyLogo;
    private String city;
    private UUID resumeId;
    private String resumeName;
    private ApplicationStatus status;
    private Instant appliedAt;
    private Instant updatedAt;

    public static ApplicationResponse fromEntity(JobApplication entity) {
        return ApplicationResponse.builder()
                .id(entity.getId())
                .candidateId(entity.getCandidate().getId())
                .jobId(entity.getJob().getId())
                .jobTitle(entity.getJob().getTitle())
                .companyName(entity.getJob().getCompanyName())
                .companyLogo(entity.getJob().getCompanyLogo())
                .city(entity.getJob().getCity())
                .resumeId(entity.getResume().getId())
                .resumeName(entity.getResume().getTitle())
                .status(entity.getStatus())
                .appliedAt(entity.getAppliedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
