import { hashPassword } from "../utilities/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../utilities/jwt.js";
import Database from "better-sqlite3";
import config from "../config.js";

export const userProfileHandler = async (request, reply) => {
  try {
    //Connect to the Database
    //const db = this.connectdb();

    const db = new Database(config.DBPATH);

    //Fetch user from Database
    const stmt = db.prepare("SELECT * FROM users WHERE uuid = ?;");
    const requestedAccount = await stmt.get(request.jwtRequestPayload.userid);

    //Check if the user exists already
    if (!requestedAccount) {
      request.log.info(
        "User was not found in the Database - Profile Update failed"
      );
      throw { statusCode: 400, message: "Profile Update Failed" };
    }

    //If user changes their password only - update the record
    let userObj = {};
    if (request.body.password) {
      const hashpwd = await hashPassword(request.body.password);

      const registerStmt = db.prepare(
        "UPDATE users SET name = ?, email = ?, password = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ? RETURNING uuid, name, email, jwt_id, password, active, created_at, updated_at;"
      );
      userObj = registerStmt.get(
        request.body.name,
        request.body.email,
        hashpwd,
        request.jwtRequestPayload.userid
      );
    } else {
      const registerStmt = db.prepare(
        "UPDATE users SET name = ?, email = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ? RETURNING uuid, name, email, jwt_id, password, active, created_at, updated_at;"
      );
      userObj = registerStmt.get(
        request.body.name,
        request.body.email,
        request.jwtRequestPayload.userid
      );
    }

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(userObj);
    const userRefreshToken = await makeRefreshtoken(userObj);

    const userAttributes = {
      name: userObj.name,
      email: userObj.email,
      created: userObj.created_at,
      access_token: userAccessToken.token,
      access_token_expiry: userAccessToken.expiration,
    };
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days

    reply.headers({
      "set-cookie": `userRefreshToken=${userRefreshToken.token}; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: userObj.uuid,
        type: "Register",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
