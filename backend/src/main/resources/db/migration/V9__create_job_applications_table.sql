-- V9__create_job_applications_table.sql
-- Create job_applications table for candidate job application submissions

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES candidate_resumes(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_job_applications_candidate_job UNIQUE (candidate_id, job_id)
);

CREATE INDEX idx_job_applications_candidate ON job_applications(candidate_id);
CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
