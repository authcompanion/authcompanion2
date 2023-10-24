BEGIN TRANSACTION;
CREATE TABLE admin (
    id INTEGER PRIMARY KEY ASC,
    uuid TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    challenge TEXT,
    jwt_id TEXT,
    active INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

UPDATE authc_version SET version = 2 WHERE version = 1;

COMMIT TRANSACTION;