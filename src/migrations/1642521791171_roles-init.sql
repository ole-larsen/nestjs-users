-- Up Migration
CREATE TABLE IF NOT EXISTS roles (
    id          SERIAL PRIMARY KEY,
    title       varchar(255) NOT NULL,
    description text NOT NULL,
    enabled     bool NOT NULL DEFAULT TRUE,
    created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted    TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
ALTER TABLE roles
    ADD CONSTRAINT roles_title_deleted UNIQUE (title, deleted);

-- Down Migration
DROP TABLE IF EXISTS roles;