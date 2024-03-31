import { verifyValueWithHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import { refreshCookie, fgpCookie } from "../../utils/cookies.js";
import config from "../../config.js";
import { eq } from "drizzle-orm";

export const loginHandler = async function (request, reply) {
  try {
    // Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, creation failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    // Fetch user from database
    const existingAccount = await this.db
      .select({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        jwt_id: this.users.jwt_id,
        password: this.users.password,
        active: this.users.active,
        created_at: this.users.created_at,
      })
      .from(this.users)
      .where(eq(this.users.email, request.body.data.attributes.email));

    // Check if user does not exist in the database
    if (!existingAccount) {
      request.log.info("Auth API: User does not exist in database, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    // Check if user has an 'active' account
    if (!existingAccount[0].active) {
      request.log.info("Auth API: User account is not active, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    const passwordCheckResult = await verifyValueWithHash(
      request.body.data.attributes.password,
      existingAccount[0].password
    );

    // Check if user has the correct password
    if (!passwordCheckResult) {
      request.log.info("Auth API: User password is incorrect, login failed");
      throw { statusCode: 400, message: "Login Failed" };
    }

    // Looks good! Let's prepare the reply
    const userAccessToken = await makeAccesstoken(existingAccount[0], this.key);
    const userRefreshToken = await makeRefreshtoken(existingAccount[0], this.key, this);

    const userAttributes = {
      name: existingAccount[0].name,
      email: existingAccount[0].email,
      created: existingAccount[0].created_at,
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
        id: existingAccount[0].uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
