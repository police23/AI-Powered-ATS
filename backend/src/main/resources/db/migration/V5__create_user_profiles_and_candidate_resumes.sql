CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    city VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20) DEFAULT 'OTHER',
    job_title VARCHAR(100),
    experience_level VARCHAR(30),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_candidate_resumes_user_id ON candidate_resumes(user_id);

-- Seed user profiles for existing candidate and HR users
INSERT INTO user_profiles (id, user_id, full_name, phone_number, city, date_of_birth, gender, job_title, experience_level, created_at, updated_at)
VALUES 
  ('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111101', 'Nguyễn Văn Candidate', '0987654321', 'HCM', '1998-05-15', 'MALE', 'frontend', 'TWO_TO_THREE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222202', 'Trần Thị HR', '0912345678', 'HN', '1995-10-20', 'FEMALE', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('55555555-5555-5555-5555-555555555503', '33333333-3333-3333-3333-333333333303', 'Lê Văn HR Manager', '0909876543', 'DN', '1990-03-12', 'MALE', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;
