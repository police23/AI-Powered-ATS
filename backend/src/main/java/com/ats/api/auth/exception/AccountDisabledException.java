package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class AccountDisabledException extends AuthException {

    public AccountDisabledException() {
        super("Tài khoản đã bị vô hiệu hóa", "AUTH_ACCOUNT_DISABLED", HttpStatus.FORBIDDEN);
    }
}
