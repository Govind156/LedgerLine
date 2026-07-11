-- ============================================================
-- V2: Reserved for future seed/reference data.
-- Default categories are created per-user in application code
-- (see CategoryService#createDefaultCategoriesForUser) right
-- after signup, since categories are scoped to each user.
-- ============================================================

-- No-op migration kept intentionally so the migration history
-- has a clear place to add reference data later without
-- renumbering existing scripts.
SELECT 1;