import * as dotenv from "dotenv";
dotenv.config();

const config = {
  // Application Settings
  AUTHPORT: parseInt(process.env.PORT || "", 10) || 3002,
  ORIGIN: process.env.ORIGIN || "http://localhost:3002",
  APPLICATIONORIGIN: process.env.APPLICATION_ORIGIN || "/",
  REGISTRATIONORIGIN: process.env.REGISTRATION_ORIGIN || process.env.APPLICATION_ORIGIN || "/",
  ADMINORIGIN: process.env.ADMIN_ORIGIN || "/admin",
  RECOVERYURL: process.env.RECOVERY_REDIRECT_URL || "http://localhost:3002/v1/web/profile",

  // Security Settings
  KEYPATH: process.env.SERVER_KEY_PATH || "./serverkey",
  ADMINKEYPATH: process.env.ADMIN_KEY_PATH || "./adminkey",
  SAMESITE: process.env.SAMESITE || "None",

  // Email SMTP Integration Settings
  SMTPHOSTNAME: process.env.SMTP_HOSTNAME || "",
  SMTPPORT: parseInt(process.env.SMTP_PORT || "", 10) || 2525,
  SMTPUSER: process.env.SMTP_USERNAME || "",
  SMTPPASSWORD: process.env.SMTP_PASSWORD || "",
  FROMADDRESS: process.env.FROM_ADDRESS || "no_reply@example.com",

  // Database Configurations
  SQLITE_ENABLED: process.env.SQLITE_ENABLED ? process.env.SQLITE_ENABLED === "true" : true,
  POSTGRESQL_ENABLED: process.env.POSTGRESQL_ENABLED ? process.env.POSTGRESQL_ENABLED === "true" : false,
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH || "./sqlite_authc_database.db",
  POSTGRESQL_CONNECTION_STRING: process.env.POSTGRESQL_CONNECTION_STRING || "postgresql://admin@localhost:5432/users",
};

export default config;
