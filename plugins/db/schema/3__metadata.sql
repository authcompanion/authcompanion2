BEGIN TRANSACTION;

ALTER TABLE users ADD COLUMN metadata text;

UPDATE authc_version SET version = 3 WHERE version = 2;

COMMIT TRANSACTION;