import { verifyValueWithHash, secureCookie } from "../../../utils/credential.js";
import { makeAdminToken, makeAdminRefreshtoken } from "../../../utils/jwt.js";
import config from "../../../config.js";
import { users } from "../../../db/sqlite/schema.js";
import { eq } from "drizzle-orm";

export const loginHandler = async function (request, reply) {
  try {
    // Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Admin API: The request's type is not set to Users, creation failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    // Fetch the registered admin user from the database
    const existingAccount = await this.db
      .select({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        password: users.password,
        active: users.active,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.email, request.body.data.attributes.email))
      .where(eq(users.isAdmin, 1))
      .get();

    // Check if admin user does not exist in the database
    if (!existingAccount) {
      request.log.info("Admin API: User does not exist in database, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }
    // Check if user has an 'active' account
    if (!existingAccount.active) {
      request.log.info("Admin API: User account is not active, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    const passwordCheckResult = await verifyValueWithHash(
      request.body.data.attributes.password,
      existingAccount.password
    );

    // Check if user has the correct password
    if (!passwordCheckResult) {
      request.log.info("Admin API: User password is incorrect, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    // Looks good! Let's prepare the reply
    const adminAccessToken = await makeAdminToken(existingAccount, this.key);
    const adminRefreshToken = await makeAdminRefreshtoken(existingAccount, this.key);

    const userAttributes = {
      name: existingAccount.name,
      email: existingAccount.email,
      created: existingAccount.created_at,
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
        id: userAttributes.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
