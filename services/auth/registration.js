import { createHash } from "../../utils/credential.js";
import { randomUUID } from "crypto";
import { createId } from "@paralleldrive/cuid2";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";

export const registrationHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info(
        "Auth API: The request's type is not set to Users, registration failed"
      );
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists already
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?;");
    const requestedAccount = await stmt.get(request.body.data.attributes.email);

    if (requestedAccount) {
      request.log.info(
        "Auth API: User already exists in database, registration failed"
      );

      throw { statusCode: 400, message: "Registration Failed" };
    }
    //Create the user in the Database
    const hashpwd = await createHash(request.body.data.attributes.password);
    const uuid = createId();
    const jwtid = randomUUID();

    const registerStmt = this.db.prepare(
      "INSERT INTO users (uuid, name, email, password, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );
    const userObj = registerStmt.get(
      uuid,
      request.body.data.attributes.name,
      request.body.data.attributes.email,
      hashpwd,
      "1",
      jwtid
    );
    //Prepare the reply
    const userAccessToken = await makeAccesstoken(userObj, this.key);
    const userRefreshToken = await makeRefreshtoken(userObj, this.key);

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
      "set-cookie": [
        `userRefreshToken=${userRefreshToken.token}; Path=/; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
        `Fgp=${userAccessToken.userFingerprint}; Path=/; Max-Age=3600; SameSite=None; Secure; HttpOnly`,
      ],
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    reply.statusCode = 201;

    return {
      data: {
        type: "users",
        id: userObj.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
