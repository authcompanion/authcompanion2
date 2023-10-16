BEGIN TRANSACTION;

ALTER TABLE users ADD COLUMN appdata text;

UPDATE authc_version SET version = 4 WHERE version = 3;

COMMIT TRANSACTION;