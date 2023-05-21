-- Up Migration
CREATE TABLE user_role (
    user_id INT NOT NULL,
    role_id INT NOT NULL DEFAULT 3,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down Migration
DROP TABLE IF EXISTS user_role;