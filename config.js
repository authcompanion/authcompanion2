import * as dotenv from "dotenv";
dotenv.config();

const config = {
  //Application Settings
  AUTHPORT: parseInt(process.env.PORT, 10) || 3002, // Port for authentication server
  ORIGIN: process.env.ORIGIN || "http://localhost:3002", // Origin for web application used as the appurl in webauthn
  APPLICATIONORIGIN: process.env.APPLICATION_ORIGIN || "http://localhost:3002/v1/web/home",
  REGISTRATIONORIGIN:
    process.env.REGISTRATION_ORIGIN || process.env.APPLICATION_ORIGIN || "http://localhost:3002/v1/web/home",
  ADMINORIGIN: process.env.ADMIN_ORIGIN || "http://localhost:3002/v1/admin/dashboard", //url for the admin dashboard
  RECOVERYURL: process.env.RECOVERY_REDIRECT_URL || "http://localhost:3002/v1/web/profile", // URL for recovery redirect, defaults to a recovery profile URL

  // Security Settings
  KEYPATH: process.env.SERVER_KEY_PATH || "./serverkey", // Path for the server key
  ADMINKEYPATH: process.env.ADMIN_KEY_PATH || "./adminkey", // Path for the admin's username and password for the Admin Panel
  SAMESITE: process.env.SAMESITE || "None", // SameSite attribute for cookies, defaulting to "None"

  // Email SMTP Integration Settings
  SMTPHOSTNAME: process.env.SMTP_HOSTNAME || "", // SMTP server hostname
  SMTPPORT: parseInt(process.env.SMTP_PORT, 10) || 2525, // SMTP server port (default: 2525)
  SMTPUSER: process.env.SMTP_USERNAME || "", // Username for SMTP authentication
  SMTPPASSWORD: process.env.SMTP_PASSWORD || "", // Password for SMTP authentication
  FROMADDRESS: process.env.FROM_ADDRESS || "no_reply@example.com", // Default "From" address for outgoing emails

  // SQLite and PostgreSQL Configurations
  SQLITE_ENABLED: process.env.SQLITE_ENABLED || false, // Set to true if SQLite is enabled
  POSTGRESQL_ENABLED: process.env.POSTGRESQL_ENABLED || true, // Set to true if PostgreSQL is enabled
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH || "./sqlite_authc_database.db", // Path for SQLite database
  POSTGRESQL_CONNECTION_STRING:
    process.env.POSTGRESQL_CONNECTION_STRING || "postgresql://paulfish@localhost:5432/paulfish", // Connection string for PostgreSQL
};

export default config;
