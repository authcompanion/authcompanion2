import { makeAdminToken, makeAdminRefreshtoken, validateJWT } from "../../../utils/jwt.js";
import config from "../../../config.js";

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
    const jwtClaims = await validateJWT(refreshToken, this.key);

    // Fetch the registered admin user from the database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, password, active, created_at, updated_at FROM admin WHERE uuid = ?;"
    );
    const userObj = await stmt.get(jwtClaims.userid);

    // Check if the "jiti" value in the JWT payload matches the admin's "jwt_id"
    if (jwtClaims.jti !== userObj.jwt_id) {
      request.log.info("Admin API: JWT jiti value does not match the admin's jwt_id");
      throw {
        statusCode: 401,
        message: "Server Error",
      };
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
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: userObj.uuid,
        type: "users",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
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
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, created_at, updated_at FROM admin WHERE jwt_id = ?;"
    );
    const userObj = await stmt.get(jwtClaims.jti);
    if (userObj === undefined) {
      request.log.info("Admin API: User not found");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    const delStmt = this.db.prepare("UPDATE admin SET jwt_id = 0 WHERE jwt_id = ?");
    const resp = await delStmt.run(jwtClaims.jti);
    if (resp.changes !== 1) {
      request.log.info("Error deleting token id");
      throw { statusCode: 500, message: "Internal Error" };
    }

    reply.code(204);
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
