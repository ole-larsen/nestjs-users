-- Up Migration
CREATE TABLE IF NOT EXISTS users_addresses (
    id                     SERIAL PRIMARY KEY,
    user_id                INTEGER,
    address_type           varchar(255),
    country                varchar(255),
    region                 varchar(255),
    district               varchar(255),
    city                   varchar(255),
    zip                    INTEGER,
    street                 varchar(255),
    house                  varchar(255),
    block                  varchar(18),
    apartments             varchar(255),
    coordinates            varchar(255),
    additional             text,
    enabled                bool NOT NULL DEFAULT TRUE,
    created                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted                TIMESTAMP WITH TIME ZONE DEFAULT NULL
                                         );
ALTER TABLE users_addresses ADD CONSTRAINT users_addresses_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Down Migration
DROP TABLE IF EXISTS users_addresses;