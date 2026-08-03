package com.ats.api.profile.exception;

import org.springframework.http.HttpStatus;

public class FileUploadException extends ProfileException {

    public FileUploadException(String message, String code) {
        super(message, code, HttpStatus.BAD_REQUEST);
    }
}
