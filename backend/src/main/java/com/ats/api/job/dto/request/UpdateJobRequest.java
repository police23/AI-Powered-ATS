package com.ats.api.job.dto.request;

import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.profile.entity.ExperienceLevel;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {

    @NotBlank(message = "Tên công việc không được để trống")
    @Size(max = 200, message = "Tên công việc không vượt quá 200 ký tự")
    private String title;

    @NotBlank(message = "Tên công ty không được để trống")
    @Size(max = 150, message = "Tên công ty không vượt quá 150 ký tự")
    private String companyName;

    private String companyLogo;

    @NotBlank(message = "Thành phố không được để trống")
    @Size(max = 50, message = "Tên thành phố không vượt quá 50 ký tự")
    private String city;

    private String addressDetail;

    @NotNull(message = "Hình thức làm việc không được để trống")
    private EmploymentType employmentType;

    @NotNull(message = "Mức kinh nghiệm không được để trống")
    private ExperienceLevel experienceLevel;

    private BigDecimal salaryMin;

    private BigDecimal salaryMax;

    private boolean isNegotiableSalary;

    @Builder.Default
    private String currency = "VND";

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    private String requirements;

    private String benefits;

    @NotNull(message = "Trạng thái không được để trống")
    private JobStatus status;

    @Future(message = "Hạn nộp hồ sơ phải là môt thời điểm trong tương lai")
    private Instant expiredAt;
}
