package com.ats.api.auth.exception;

import org.springframework.http.HttpStatus;

public class AccountLockedException extends AuthException {

    public AccountLockedException(String message) {
        super(message, "AUTH_ACCOUNT_LOCKED", HttpStatus.FORBIDDEN);
    }
}
