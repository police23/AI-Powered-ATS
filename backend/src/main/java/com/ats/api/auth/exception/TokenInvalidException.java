package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class TokenInvalidException extends AuthException {

    public TokenInvalidException(String message) {
        super(message, "AUTH_TOKEN_INVALID", HttpStatus.UNAUTHORIZED);
    }
}
