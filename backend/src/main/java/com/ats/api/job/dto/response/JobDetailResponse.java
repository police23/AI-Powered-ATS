package com.ats.api.job.dto.response;

import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.profile.entity.ExperienceLevel;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDetailResponse {

    private UUID id;
    private String companyName;
    private String companyLogo;
    private String title;
    private String description;
    private String requirements;
    private String benefits;
    private String city;
    private String addressDetail;
    private EmploymentType employmentType;
    private ExperienceLevel experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    @JsonProperty("isNegotiableSalary")
    private boolean isNegotiableSalary;

    private String currency;
    private JobStatus status;
    private int viewsCount;
    private Instant expiredAt;
    private Instant createdAt;

    public static JobDetailResponse fromEntity(Job job) {
        if (job == null) return null;

        return JobDetailResponse.builder()
                .id(job.getId())
                .companyName(job.getCompanyName())
                .companyLogo(job.getCompanyLogo())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .city(job.getCity())
                .addressDetail(job.getAddressDetail())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .isNegotiableSalary(job.isNegotiableSalary())
                .currency(job.getCurrency())
                .status(job.getStatus())
                .viewsCount(job.getViewsCount())
                .expiredAt(job.getExpiredAt())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
