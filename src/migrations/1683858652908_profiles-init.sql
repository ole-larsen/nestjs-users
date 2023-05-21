-- Up Migration
CREATE TABLE IF NOT EXISTS users_profiles (
    id                     SERIAL PRIMARY KEY,
    user_id                INTEGER,
    username               varchar(255),
    first_name             varchar(255),
    last_name              varchar(255),
    birthdate              TIMESTAMP WITH TIME ZONE,
    about                  text,
    enabled                bool NOT NULL DEFAULT TRUE,
    created                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted                TIMESTAMP WITH TIME ZONE DEFAULT NULL
 );
ALTER TABLE users_profiles ADD CONSTRAINT users_profiles_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE users ADD CONSTRAINT users_profiles_profile_id_foreign
    FOREIGN KEY (profile_id) REFERENCES users_profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Down Migration
DROP TABLE IF EXISTS users_profiles CASCADE;