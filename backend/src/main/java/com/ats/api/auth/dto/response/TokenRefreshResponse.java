package com.ats.api.auth.dto.response;

public record TokenRefreshResponse(
        String accessToken,
        String tokenType,
        long expiresIn
) {
}
