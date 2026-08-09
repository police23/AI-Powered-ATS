package com.ats.api.job.dto.request;

import com.ats.api.job.entity.enums.JobStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobStatusUpdateRequest {

    @NotNull(message = "Trạng thái bài tuyển dụng không được để trống")
    private JobStatus status;
}
