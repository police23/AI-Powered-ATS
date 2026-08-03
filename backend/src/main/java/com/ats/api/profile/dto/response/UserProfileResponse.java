package com.ats.api.profile.dto.response;

import com.ats.api.profile.entity.ExperienceLevel;
import com.ats.api.profile.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private UUID userId;
    private String email;
    private String role;
    private String fullName;
    private String phoneNumber;
    private String city;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String jobTitle;
    private ExperienceLevel experienceLevel;
    private String avatarUrl;
    private ResumeResponse resume;
    private CompanySummaryResponse company;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanySummaryResponse {
        private UUID id;
        private String name;
    }
}
