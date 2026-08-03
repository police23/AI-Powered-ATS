package com.ats.api.job.specification;

import com.ats.api.job.dto.request.JobSearchFilterRequest;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.JobStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    public static Specification<Job> filterJobs(JobSearchFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always enforce PUBLISHED status for public/candidate search
            predicates.add(cb.equal(root.get("status"), JobStatus.PUBLISHED));

            if (filter != null) {
                // Filter by Keyword (title or companyName)
                if (StringUtils.hasText(filter.getKeyword())) {
                    String pattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                    Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                    Predicate companyMatch = cb.like(cb.lower(root.get("companyName")), pattern);
                    predicates.add(cb.or(titleMatch, companyMatch));
                }

                // Filter by City
                if (StringUtils.hasText(filter.getCity())) {
                    predicates.add(cb.equal(cb.lower(root.get("city")), filter.getCity().trim().toLowerCase()));
                }

                // Filter by Experience Level
                if (filter.getExperienceLevel() != null) {
                    predicates.add(cb.equal(root.get("experienceLevel"), filter.getExperienceLevel()));
                }

                // Filter by Employment Type
                if (filter.getEmploymentType() != null) {
                    predicates.add(cb.equal(root.get("employmentType"), filter.getEmploymentType()));
                }

                // Filter by Min Salary
                if (filter.getMinSalary() != null) {
                    Predicate salaryMaxGe = cb.greaterThanOrEqualTo(root.get("salaryMax"), filter.getMinSalary());
                    Predicate negotiable = cb.isTrue(root.get("isNegotiableSalary"));
                    predicates.add(cb.or(salaryMaxGe, negotiable));
                }

                // Filter by Max Salary
                if (filter.getMaxSalary() != null) {
                    Predicate salaryMinLe = cb.lessThanOrEqualTo(root.get("salaryMin"), filter.getMaxSalary());
                    Predicate negotiable = cb.isTrue(root.get("isNegotiableSalary"));
                    predicates.add(cb.or(salaryMinLe, negotiable));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
