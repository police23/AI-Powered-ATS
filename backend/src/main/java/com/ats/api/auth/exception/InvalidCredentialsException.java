package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class InvalidCredentialsException extends AuthException {

    public InvalidCredentialsException() {
        super("Email hoặc mật khẩu không chính xác", "AUTH_INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED);
    }
}
