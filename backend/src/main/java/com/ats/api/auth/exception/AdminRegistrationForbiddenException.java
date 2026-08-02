package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class AdminRegistrationForbiddenException extends AuthException {

    public AdminRegistrationForbiddenException() {
        super("Nghiêm cấm đăng ký tài khoản với vai trò ADMIN", "AUTH_ADMIN_REGISTRATION_FORBIDDEN", HttpStatus.FORBIDDEN);
    }
}
