package com.ats.api.application.dto.response;

import com.ats.api.application.entity.enums.ApplicationStatus;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationCheckResponse {

    @com.fasterxml.jackson.annotation.JsonProperty("isApplied")
    private boolean isApplied;
    private UUID jobId;
    private UUID applicationId;
    private ApplicationStatus status;
}
