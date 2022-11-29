import { makeRefreshtoken } from "../utilities/jwt.js";
import Database from "better-sqlite3";
import config from "../config.js";
import { SMTPClient } from "emailjs";

export const profileRecoveryHandler = async (request, reply) => {
  const client = new SMTPClient({
    user: config.SMTPUSER,
    password: config.SMTPPASSWORD,
    host: config.SMTPHOSTNAME,
    port: config.SMTPPORT,
    //ssl: true,
  });
  try {
    //Connect to the Database
    //const db = await fastify.connectdb();

    const db = new Database(config.DBPATH);

    //Fetch user from Database
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?;");
    const userObj = await stmt.get(request.body.email);

    //Check if the user exists in the database, before issuing recovery token
    if (!userObj) {
      request.log.info(
        "User was not found in the Database - Profile Recovery failed"
      );
      throw { statusCode: 400, message: "Profile Resovery Failed" };
    }

    //Prepare & send the recovery email
    const userRecoveryToken = await makeRefreshtoken(userObj, {
      recoveryToken: "true",
    });

    const message = await client.sendAsync({
      from: config.FROMADDRESS,
      to: userObj.email,
      //cc: 'else <else@your-email.com>',
      subject: "Account Recovery",
      attachment: [
        {
          data: `Hello </br></br>
        You recently requested a password reset for your account.</br>
        Please use the following link to login again. This password reset is only valid for the next 15 minutes: </br>
        <a href="${config.RECOVERYURL}?token=${userRecoveryToken.token}">Reset your password</a>`,
          alternative: true,
        },
      ],
    });

    return {
      data: {
        type: "Profile Recovery",
        detail:
          "An email containing a recovery link has been sent to the email address provided",
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
