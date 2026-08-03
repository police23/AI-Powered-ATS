-- Migration V6: Upgrade candidate_resumes to support Multi-Resume Portfolio per Candidate

-- Remove UNIQUE constraint on user_id to allow multiple resumes
ALTER TABLE candidate_resumes DROP CONSTRAINT IF EXISTS candidate_resumes_user_id_key;

-- Add title column with default value
ALTER TABLE candidate_resumes ADD COLUMN IF NOT EXISTS title VARCHAR(150) NOT NULL DEFAULT 'CV Ứng tuyển';

-- Add is_default column with default value false
ALTER TABLE candidate_resumes ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT FALSE;

-- Create composite index for efficient user resume lookup
CREATE INDEX IF NOT EXISTS idx_candidate_resumes_user_default ON candidate_resumes(user_id, is_default);
