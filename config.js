import * as dotenv from "dotenv";
dotenv.config();

const AUTHPORT = process.env.PORT || "3002";
const RECOVERYURL =
  process.env.RECOVERY_REDIRECT_URL || "http://localhost:3002/v1/web/home";
const DBPATH = process.env.DB_PATH || "./authcompanion_users.db";
const KEYPATH = process.env.KEY_PATH || "./keyfile";
const WEBMODE = process.env.WEB_MODE || "true";
const APPLICATIONORIGIN = process.env.APPLICATION_ORIGIN || "/v1/web/home";
const SMTPHOSTNAME = process.env.SMTP_HOSTNAME || "smtp.mailtrap.io";
const SMTPPORT = process.env.SMTP_PORT || "2525";
const SMTPUSER = process.env.SMTP_USERNAME || "b22fdacb75ffcd";
const SMTPPASSWORD = process.env.SMTP_PASSWORD || "2ac28946d21548";
const FROMADDRESS = process.env.FROM_ADDRESS || "no_reply@example.com";

export default {
  AUTHPORT,
  KEYPATH,
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
