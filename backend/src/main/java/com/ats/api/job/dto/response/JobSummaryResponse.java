package com.ats.api.job.dto.response;

import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
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
public class JobSummaryResponse {

    private UUID id;
    private String companyName;
    private String companyLogo;
    private String title;
    private String city;
    private String addressDetail;
    private EmploymentType employmentType;
    private ExperienceLevel experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    @JsonProperty("isNegotiableSalary")
    private boolean isNegotiableSalary;

    @JsonProperty("isSaved")
    private boolean isSaved;

    private String currency;
    private int viewsCount;
    private Instant createdAt;

    public static JobSummaryResponse fromEntity(Job job) {
        return fromEntity(job, false);
    }

    public static JobSummaryResponse fromEntity(Job job, boolean isSaved) {
        if (job == null) return null;

        return JobSummaryResponse.builder()
                .id(job.getId())
                .companyName(job.getCompanyName())
                .companyLogo(job.getCompanyLogo())
                .title(job.getTitle())
                .city(job.getCity())
                .addressDetail(job.getAddressDetail())
                .employmentType(job.getEmploymentType())
                .experienceLevel(job.getExperienceLevel())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .isNegotiableSalary(job.isNegotiableSalary())
                .isSaved(isSaved)
                .currency(job.getCurrency())
                .viewsCount(job.getViewsCount())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
