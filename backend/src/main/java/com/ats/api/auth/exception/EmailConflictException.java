package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class EmailConflictException extends AuthException {

    public EmailConflictException() {
        super("Email đã tồn tại trong hệ thống", "AUTH_EMAIL_CONFLICT", HttpStatus.CONFLICT);
    }
}
