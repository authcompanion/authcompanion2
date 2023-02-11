import * as dotenv from "dotenv";
dotenv.config();

const AUTHPORT = process.env.PORT || "3002";
const ORIGIN = process.env.ORIGIN || "http://localhost:3002";
const APPLICATIONORIGIN =
  process.env.APPLICATION_ORIGIN || "http://localhost:3002/v1/web/home";
const DBPATH = process.env.DB_PATH || "./authcompanion_users.db";
const KEYPATH = process.env.SERVER_KEY_PATH || "./serverkey";
const ADMINKEYPATH = process.env.ADMIN_KEY_PATH || "./adminkey";
const WEBMODE = process.env.WEB_MODE || "true";
const RECOVERYURL =
  process.env.RECOVERY_REDIRECT_URL || "http://localhost:3002/v1/web/profile";
const SMTPHOSTNAME = process.env.SMTP_HOSTNAME || "";
const SMTPPORT = process.env.SMTP_PORT || "2525";
const SMTPUSER = process.env.SMTP_USERNAME || "";
const SMTPPASSWORD = process.env.SMTP_PASSWORD || "";
const FROMADDRESS = process.env.FROM_ADDRESS || "no_reply@example.com";

export default {
  AUTHPORT,
  ORIGIN,
  KEYPATH,
  ADMINKEYPATH,
  SMTPHOSTNAME,
  SMTPPORT,
  SMTPUSER,
  SMTPPASSWORD,
  FROMADDRESS,
  RECOVERYURL,
  WEBMODE,
  APPLICATIONORIGIN,
  DBPATH,
};
