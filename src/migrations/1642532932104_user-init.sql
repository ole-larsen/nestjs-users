-- Up Migration
CREATE TABLE IF NOT EXISTS users (
    id                      SERIAL PRIMARY KEY,
    email                   varchar(255) NOT NULL,
    password                varchar(255) NOT NULL,
    password_reset_token    varchar(255),
    password_reset_expires  BIGINT,
    enabled                 bool NOT NULL DEFAULT TRUE,
    secret                  varchar(255),
    gravatar                varchar(255),
    profile_id              INTEGER,
    auth_confirmation_token varchar(255),
    verified               bool NOT NULL DEFAULT FALSE,
    created                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted                TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
ALTER TABLE users
    ADD CONSTRAINT users_email_deleted UNIQUE (email, deleted);

-- Down Migration
DROP TABLE IF EXISTS users;