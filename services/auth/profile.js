import { createHash, secureCookie } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";

export const userProfileHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, update failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Fetch user from Database
    const stmt = this.db.prepare("SELECT * FROM users WHERE uuid = ?;");
    const user = await stmt.get(request.jwtRequestPayload.userid);

    //Check if the user exists already
    if (!user) {
      request.log.info("Auth API: User does not exist in database, update failed");
      throw { statusCode: 400, message: "Profile Update Failed" };
    }

    //if the user's password is being updated, hash the new password
    if (request.body.data.attributes.password) {
      const hashpwd = await createHash(request.body.data.attributes.password);
      request.body.data.attributes.password = hashpwd;
    }

    //Per json-api spec: If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.
    const updateStmt = this.db.prepare(
      "UPDATE users SET name = coalesce(?, name), email = coalesce(?, email), password = coalesce(?, password), metadata = coalesce(?, metadata), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ? RETURNING uuid, name, email, metadata, appdata, jwt_id, active, created_at, updated_at;"
    );
    const userObj = updateStmt.get(
      request.body.data.attributes.name,
      request.body.data.attributes.email,
      request.body.data.attributes.password,
      JSON.stringify(request.body.data.attributes.metadata),
      request.jwtRequestPayload.userid
    );

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(userObj, this.key);
    const userRefreshToken = await makeRefreshtoken(userObj, this.key);

    const userAttributes = {
      name: userObj.name,
      email: userObj.email,
      created: userObj.created_at,
      updated: userObj.updated_at,
      access_token: userAccessToken.token,
      access_token_expiry: userAccessToken.expiration,
    };

    reply.headers({
      "set-cookie": [refreshCookie(userRefreshToken.token), fgpCookie(userAccessToken.userFingerprint)],
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

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
