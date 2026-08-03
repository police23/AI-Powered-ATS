package com.ats.api.job.exception;

import org.springframework.http.HttpStatus;

public class JobNotFoundException extends JobException {

    public JobNotFoundException(String message) {
        super(message, "JOB_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
