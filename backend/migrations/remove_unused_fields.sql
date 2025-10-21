-- Migration: Remove unused fields from models
-- Date: 2025-10-22
-- Description: Simplify database schema by removing unused columns

-- Remove unused columns from users table
ALTER TABLE users DROP COLUMN IF EXISTS is_premium;
ALTER TABLE users DROP COLUMN IF EXISTS last_login;

-- Remove unused columns from pois table
ALTER TABLE pois DROP COLUMN IF EXISTS foursquare_id;
ALTER TABLE pois DROP COLUMN IF EXISTS postal_code;
ALTER TABLE pois DROP COLUMN IF EXISTS subcategory;
ALTER TABLE pois DROP COLUMN IF EXISTS popularity_score;
ALTER TABLE pois DROP COLUMN IF EXISTS is_verified;

-- Remove unused column from user_preferences table
ALTER TABLE user_preferences DROP COLUMN IF EXISTS accessibility_required;

-- Note: Run this migration after backing up your database
-- To rollback, you'll need to recreate these columns
