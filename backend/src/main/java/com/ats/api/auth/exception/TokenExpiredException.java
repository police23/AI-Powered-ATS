package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends AuthException {

    public TokenExpiredException(String message) {
        super(message, "AUTH_TOKEN_EXPIRED", HttpStatus.UNAUTHORIZED);
    }
}
