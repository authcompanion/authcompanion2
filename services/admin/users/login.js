import { verifyValueWithHash, secureCookie } from "../../../utils/credential.js";
import { makeAdminToken, makeAdminRefreshtoken } from "../../../utils/jwt.js";
import config from "../../../config.js";

export const loginHandler = async function (request, reply) {
  try {
    // Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, creation failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    // Fetch the registered admin user from the database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, password, active, created_at, updated_at FROM admin WHERE email = ?;"
    );
    const userObj = await stmt.get(request.body.data.attributes.email);

    // Check if admin user does not exist in the database
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
    const adminAccessToken = await makeAdminToken(userObj, this.key);
    const adminRefreshToken = await makeAdminRefreshtoken(userObj, this.key);

    const userAttributes = {
      name: userObj.name,
      email: userObj.email,
      created: userObj.created_at,
      access_token: adminAccessToken.token,
      access_token_expiry: adminAccessToken.expiration,
      refresh_token: adminRefreshToken.token,
    };
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days

    reply.headers({
      "set-cookie": [
        `adminDashboardAccessToken=${adminAccessToken.token}; Path=/; Expires=${expireDate}; SameSite=${
          config.SAMESITE
        }; HttpOnly; ${secureCookie()}`,
      ],
      "x-authc-app-origin": config.ADMINORIGIN,
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
