-- V10__drop_cover_letter_from_job_applications.sql
-- Drop unused cover_letter column from job_applications table

ALTER TABLE job_applications DROP COLUMN IF EXISTS cover_letter;
