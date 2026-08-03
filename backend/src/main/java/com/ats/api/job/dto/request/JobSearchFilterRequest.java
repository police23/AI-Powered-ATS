package com.ats.api.job.dto.request;

import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.profile.entity.ExperienceLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSearchFilterRequest {

    private String keyword;
    private String city;
    private ExperienceLevel experienceLevel;
    private EmploymentType employmentType;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;

    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortOrder = "desc";
}
