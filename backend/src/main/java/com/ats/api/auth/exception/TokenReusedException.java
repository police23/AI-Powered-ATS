package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class TokenReusedException extends AuthException {

    public TokenReusedException() {
        super("Phát hiện tái sử dụng Refresh Token cũ (Token Family bị thu hồi)", "AUTH_TOKEN_REUSED", HttpStatus.UNAUTHORIZED);
    }
}
