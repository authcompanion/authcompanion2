CREATE TABLE users (
    id INTEGER PRIMARY KEY ASC,
    uuid TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    challenge TEXT,
    jwt_id TEXT NOT NULL,
    active INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    authenticator_id INTEGER,
    FOREIGN KEY(authenticator_id) REFERENCES Authenticator(id)
);

CREATE TABLE authenticator (
    id INTEGER PRIMARY KEY ASC,
    credentialID TEXT NOT NULL,
    credentialPublicKey TEXT NOT NULL,
    counter INTEGER NOT NULL,
    transports TEXT
);

CREATE TABLE authc_version (
    version INTEGER PRIMARY KEY
);

INSERT INTO authc_version(version) VALUES (1);