import { verifyValueWithHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";

export const loginHandler = async function (request, reply) {
  try {
    // Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, creation failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    // Fetch user from database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, password, active, created_at, updated_at, metadata FROM users WHERE email = ?;"
    );
    const userObj = await stmt.get(request.body.data.attributes.email);

    // Check if user does not exist in the database
    if (!userObj) {
      request.log.info("Auth API: User does not exist in database, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    // Check if user has an 'active' account
    if (!userObj.active) {
      request.log.info("Auth API: User account is not active, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    const passwordCheckResult = await verifyValueWithHash(request.body.data.attributes.password, userObj.password);

    // Check if user has the correct password
    if (!passwordCheckResult) {
      request.log.info("Auth API: User password is incorrect, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    // Looks good! Let's prepare the reply
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
