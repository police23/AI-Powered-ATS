package com.ats.api.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateApplicationRequest {

    @NotNull(message = "Job ID không được để trống")
    private UUID jobId;

    @NotNull(message = "Resume ID không được để trống")
    private UUID resumeId;
}
