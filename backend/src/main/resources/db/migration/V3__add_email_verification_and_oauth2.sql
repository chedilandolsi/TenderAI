-- V3__add_email_verification_and_oauth2.sql
-- Add email verification, OAuth2 provider fields, and make password_hash nullable

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) NOT NULL DEFAULT 'LOCAL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);

-- Allow password_hash to be NULL for OAuth2 users (e.g. Google Login)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Mark existing demo user as verified
UPDATE users SET email_verified = TRUE WHERE id = 1;

CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);
