package com.ats.api.auth.dto.response;

import java.time.Instant;
import java.util.List;

public record ErrorResponse(
        String code,
        String message,
        int status,
        Instant timestamp,
        String path,
        List<String> errors
) {
}
