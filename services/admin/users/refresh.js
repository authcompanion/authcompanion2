import { makeAdminToken, makeAdminRefreshtoken, validateJWT } from "../../../utils/jwt.js";
import config from "../../../config.js";
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
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        jwt_id: this.users.jwt_id,
        active: this.users.active,
        isAdmin: this.users.isAdmin,
        created: this.users.created_at,
        updated: this.users.updated_at,
      })
      .from(this.users)
      .where(eq(this.users.jwt_id, jwtClaims.jti));

    // Check if a user with that JWT is returned.
    if (existingAccount.length === 0) {
      request.log.info("Auth API: User not found when Refreshing Token");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    // Looks good! Let's prepare the reply
    const adminAccessToken = await makeAdminToken(existingAccount[0], this.key);
    const adminRefreshToken = await makeAdminRefreshtoken(existingAccount[0], this.key, this);

    const userAttributes = {
      name: existingAccount[0].name,
      email: existingAccount[0].email,
      created: existingAccount[0].created_at,
      access_token: adminAccessToken.token,
      access_token_expiry: adminAccessToken.expiration,
      refresh_token: adminRefreshToken.token,
    };

    reply.headers({
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
        uuid: this.users.uuid,
      })
      .from(this.users)
      .where(eq(this.users.jwt_id, jwtClaims.jti));

    if (existingAccount.length === 0) {
      request.log.info("Admin API: User not found");
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
