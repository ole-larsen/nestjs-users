-- Up Migration
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Down Migration
DROP EXTENSION IF EXISTS pgcrypto;
