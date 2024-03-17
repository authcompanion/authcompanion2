import { makeAdminToken, makeAdminRefreshtoken, validateJWT } from "../../../utils/jwt.js";
import config from "../../../config.js";
import { users } from "../../../db/sqlite/schema.js";
import { eq } from "drizzle-orm";

export const tokenRefreshHandler = async function (request, reply) {
  try {
    let refreshToken = "";
    // Check if the request body contains a refresh token
    if (request.body && request.body.refreshToken) {
      refreshToken = request.body.refreshToken;
    } else {
      request.log.info(
        "Admin API: The request does not include a refresh token in the request body, refresh token failed"
      );
      throw {
        statusCode: 400,
        message: "The request does not include a refresh token in the request body.",
      };
    }

    // Validate the refresh token
    let jwtClaims = await validateJWT(refreshToken, this.key);

    // Fetch the registered admin user from the database
    const existingAccount = await this.db
      .select({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        jwt_id: users.jwt_id,
        active: users.active,
        isAdmin: users.isAdmin,
        created: users.created_at,
        updated: users.updated_at,
      })
      .from(users)
      .where(eq(users.jwt_id, jwtClaims.jti))
      .get();

    // Check if a user with that JWT is returned.
    if (!existingAccount) {
      request.log.info("Auth API: User not found when Refreshing Token");
      throw { statusCode: 400, message: "Refresh Token Failed" };
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

    reply.headers({
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: existingAccount.uuid,
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
    let refreshToken = "";
    // Check if the request body contains a refresh token
    if (request.body && request.body.refreshToken) {
      refreshToken = request.body.refreshToken;
    } else {
      request.log.info(
        "Admin API: The request does not include a refresh token in the request body, refresh token failed"
      );
      throw {
        statusCode: 400,
        message: "The request does not include a refresh token in the request body.",
      };
    }

    //Validate the refresh token
    const jwtClaims = await validateJWT(refreshToken, this.key);
    //Fetch user from Database
    const existingAccount = await this.db
      .select({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        jwt_id: users.jwt_id,
        active: users.active,
        isAdmin: users.isAdmin,
        created: users.created_at,
        updated: users.updated_at,
      })
      .from(users)
      .where(eq(users.jwt_id, jwtClaims.jti))
      .get();

    if (!existingAccount) {
      request.log.info("Admin API: User not found");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    const resp = await this.db.update(users).set({ jwt_id: null }).where(eq(users.jwt_id, jwtClaims.jti));

    if (resp.changes !== 1) {
      request.log.info("Error deleting token id");
      throw { statusCode: 500, message: "Internal Error" };
    }

    reply.code(204);
  } catch (err) {
    throw err;
  }
};
