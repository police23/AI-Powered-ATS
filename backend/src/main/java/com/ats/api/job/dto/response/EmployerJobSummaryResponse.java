package com.ats.api.job.dto.response;

import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.profile.entity.ExperienceLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployerJobSummaryResponse {

    private UUID id;
    private UUID employerId;
    private String title;
    private String companyName;
    private String companyLogo;
    private String city;
    private EmploymentType employmentType;
    private ExperienceLevel experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private boolean isNegotiableSalary;
    private String currency;
    private JobStatus status;
    private int viewsCount;
    private long applicationsCount;
    private long newApplicationsCount;
    private Instant expiredAt;
    private Instant createdAt;
    private Instant updatedAt;
}
