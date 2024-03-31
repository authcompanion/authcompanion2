import { makeAccesstoken, makeRefreshtoken, validateJWT } from "../../utils/jwt.js";
import config from "../../config.js";
import { parse } from "cookie";
import { refreshCookie, fgpCookie } from "../../utils/cookies.js";
import { users } from "../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const tokenRefreshHandler = async function (request, reply) {
  try {
    //Check if the request includes a refresh token in request cookie
    if (request.headers.cookie) {
      const cookies = parse(request.headers.cookie);
      request.refreshToken = cookies.userRefreshToken;

      if (!request.refreshToken) {
        request.log.info("Auth API: The request does not include a refresh token as cookie, refresh failed");
        throw { statusCode: 400, message: "Refresh Token Failed" };
      }
    } else {
      request.log.info("Auth API: The request does not include a refresh token as cookie, refresh failed");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    //Validate the refresh token
    const jwtClaims = await validateJWT(request.refreshToken, this.key);

    //Fetch user from Database
    const existingAccount = await this.db
      .select({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        jwt_id: users.jwt_id,
        active: users.active,
        created: this.users.created_at,
        updated: this.users.updated_at,
      })
      .from(this.users)
      .where(eq(this.users.jwt_id, jwtClaims.jti));

    if (existingAccount.length === 0) {
      request.log.info("Auth API: User not found");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    //Prepare the reply
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
        id: existingAccount[0].uuid,
        type: "users",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};

export const tokenRefreshDeleteHandler = async function (request, reply) {
  try {
    //Check if the request includes a refresh token in request cookie
    if (request.headers.cookie) {
      const cookies = parse(request.headers.cookie);
      request.refreshToken = cookies.userRefreshToken;

      if (!request.refreshToken) {
        request.log.info("Auth API: The request does not include a refresh token as cookie, refresh failed");
        throw { statusCode: 400, message: "Refresh Token Failed" };
      }
    } else {
      request.log.info("Auth API: The request does not include a refresh token as cookie, refresh failed");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    //Validate the refresh token
    const jwtClaims = await validateJWT(request.refreshToken, this.key);
    //Fetch user from Database
    const existingAccount = await this.db
      .select({
        uuid: users.uuid,
      })
      .from(this.users)
      .where(eq(this.users.jwt_id, jwtClaims.jti));

    if (existingAccount.length === 0) {
      request.log.info("Auth API: User not found");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    const resp = await this.db
      .update(this.users)
      .set({ jwt_id: null })
      .where(eq(this.users.jwt_id, jwtClaims.jti))
      .returning({ uuid: this.users.uuid });

    if (resp.length === 0) {
      request.log.info("Error deleting token id");
      throw { statusCode: 500, message: "Internal Error" };
    }

    reply.code(204);
  } catch (err) {
    throw err;
  }
};
