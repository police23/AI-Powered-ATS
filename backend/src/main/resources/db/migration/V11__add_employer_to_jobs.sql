-- Migration V11: Add employer_id column to jobs table for ownership enforcement

ALTER TABLE jobs
ADD COLUMN employer_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_employer_status ON jobs(employer_id, status);

-- Update existing seed jobs to belong to default seed HR recruiter user
UPDATE jobs
SET employer_id = '22222222-2222-2222-2222-222222222202'
WHERE employer_id IS NULL;
