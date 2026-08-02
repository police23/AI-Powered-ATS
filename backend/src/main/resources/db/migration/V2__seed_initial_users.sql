-- Seed data for initial users (1 account for each UserRole: CANDIDATE, HR, HR_MANAGER, ADMIN)
-- All seed accounts have password: Password123!
-- BCrypt hash for Password123!: $2a$10$CXd8Xp.WPDuYI.3dVCzTnudmJr/kMAtRV8WFY9zkJ7tSp9ROLC3i6

INSERT INTO users (id, email, password_hash, role, status, failed_login_attempts, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111101', 'candidate@ats.com', '$2a$10$CXd8Xp.WPDuYI.3dVCzTnudmJr/kMAtRV8WFY9zkJ7tSp9ROLC3i6', 'CANDIDATE', 'ACTIVE', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-2222-2222-2222-222222222202', 'hr.recruiter@ats.com', '$2a$10$CXd8Xp.WPDuYI.3dVCzTnudmJr/kMAtRV8WFY9zkJ7tSp9ROLC3i6', 'HR', 'ACTIVE', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('33333333-3333-3333-3333-333333333303', 'hr.manager@ats.com', '$2a$10$CXd8Xp.WPDuYI.3dVCzTnudmJr/kMAtRV8WFY9zkJ7tSp9ROLC3i6', 'HR_MANAGER', 'ACTIVE', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('44444444-4444-4444-4444-444444444404', 'admin@ats.com', '$2a$10$CXd8Xp.WPDuYI.3dVCzTnudmJr/kMAtRV8WFY9zkJ7tSp9ROLC3i6', 'ADMIN', 'ACTIVE', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;
