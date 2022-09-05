import { hashPassword } from "../utilities/credential.js";
import { randomUUID } from "crypto";
import { makeAccesstoken, makeRefreshtoken } from "../utilities/jwt.js";
import Database from "better-sqlite3";
import config from "../config.js";

export const registrationHandler = async (request, reply) => {
  try {
    //Connect to the Database
    //const db = await fastify.connectdb();

    const db = new Database(config.DBPATH);

    //Check if the user exists already
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?;");
    const requestedAccount = await stmt.get(request.body.email);

    if (requestedAccount) {
      request.log.info("User already exists in database, registration failed");

      throw { statusCode: 400, message: "Registration Failed" };
    }
    //Create the user in the Database
    const hashpwd = await hashPassword(request.body.password);
    const uuid = randomUUID();
    const jwtid = randomUUID();

    const registerStmt = db.prepare(
      "INSERT INTO users (uuid, name, email, password, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );
    const userObj = registerStmt.get(
      uuid,
      request.body.name,
      request.body.email,
      hashpwd,
      "1",
      jwtid
    );
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
