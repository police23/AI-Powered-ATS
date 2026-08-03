-- Migration V8: Create saved_jobs table for candidates

CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_saved_jobs_user_job UNIQUE (user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);
