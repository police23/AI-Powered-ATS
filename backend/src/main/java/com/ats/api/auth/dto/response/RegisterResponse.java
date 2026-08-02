package com.ats.api.auth.dto.response;

import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;

import java.time.Instant;
import java.util.UUID;

public record RegisterResponse(
        UUID id,
        String email,
        UserRole role,
        AccountStatus status,
        Instant createdAt
) {
}
