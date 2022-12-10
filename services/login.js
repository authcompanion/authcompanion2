import { verifyPasswordWithHash } from "../utilities/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../utilities/jwt.js";
import config from "../config.js";

export const loginHandler = async function (request, reply) {
  try {
    // Fetch user from database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, password, active, created_at, updated_at FROM users WHERE email = ?;"
    );
    const userObj = await stmt.get(request.body.email);

    // Check if user does not exist in the database
    if (!userObj) {
      request.log.info("User was not found in the Database - Login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    // Check if user has an 'active' account
    if (!userObj.active) {
      request.log.info("User does not have an active account - Login failed ");
      throw { statusCode: 400, message: "Login Failed" };
    }

    const passwordCheckResult = await verifyPasswordWithHash(
      request.body.password,
      userObj.password
    );

    // Check if user has the correct password
    if (!passwordCheckResult) {
      request.log.info("User successfully logged into account");

      throw { statusCode: 400, message: "Login Failed" };
    }

    // Looks good! Let's prepare the reply
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
      "set-cookie": `userRefreshToken=${userRefreshToken.token}; Path=/; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: userObj.uuid,
        type: "Login",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
