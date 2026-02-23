-- ═══════════════════════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES - Run this in your Supabase SQL Editor
-- These indexes will dramatically speed up common queries
-- ═══════════════════════════════════════════════════════════════════════════════

-- Applications table indexes (most queried for students)
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at DESC);
-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_applications_student_status ON applications(student_id, status);

-- Internships table indexes
CREATE INDEX IF NOT EXISTS idx_internships_recruiter_id ON internships(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);
CREATE INDEX IF NOT EXISTS idx_internships_created_at ON internships(created_at DESC);
-- Composite index for the main listing query (status=open, ordered by created_at)
CREATE INDEX IF NOT EXISTS idx_internships_status_created ON internships(status, created_at DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Community posts indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_posted_by ON community_posts(posted_by);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- Analyze tables to update query planner statistics
ANALYZE applications;
ANALYZE internships;
ANALYZE users;
ANALYZE student_profiles;
ANALYZE recruiter_profiles;
ANALYZE community_posts;
