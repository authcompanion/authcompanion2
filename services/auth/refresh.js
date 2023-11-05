import { makeAccesstoken, makeRefreshtoken, validateJWT } from "../../utils/jwt.js";
import config from "../../config.js";
import { parse } from "cookie";
import { secureCookie } from "../../utils/credential.js";

export const tokenRefreshHandler = async function (request, reply) {
  try {
    //Check if the request includes a refresh token in request cookie
    if (request.headers.cookie) {
      const cookies = parse(request.headers.cookie);
      request.refreshToken = cookies.userRefreshToken;
    } else {
      request.log.info("Auth API: The request does not include a refresh token as cookie, refresh failed");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    //Validate the refresh token
    const jwtClaims = await validateJWT(request.refreshToken, this.key);
    //Fetch user from Database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, created_at, updated_at, metadata, appdata FROM users WHERE jwt_id = ?;"
    );
    const userObj = await stmt.get(jwtClaims.jti);
    if (userObj === undefined) {
      request.log.info("Auth API: User not found");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    //Prepare the reply
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
        `userRefreshToken=${userRefreshToken.token}; Path=/; Expires=${expireDate}; SameSite=${
          config.SAMESITE
        }; HttpOnly; ${secureCookie()}`,
        `Fgp=${userAccessToken.userFingerprint}; Path=/; Max-Age=3600; SameSite=${
          config.SAMESITE
        }; HttpOnly; ${secureCookie()}`,
      ],
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
    //Check if the request includes a refresh token in request cookie
    if (request.headers.cookie) {
      const cookies = parse(request.headers.cookie);
      request.refreshToken = cookies.userRefreshToken;
    } else {
      request.log.info("Auth API: The request does not include a refresh token as cookie, refresh failed");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    //Validate the refresh token
    const jwtClaims = await validateJWT(request.refreshToken, this.key);
    //Fetch user from Database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, created_at, updated_at, metadata, appdata FROM users WHERE jwt_id = ?;"
    );
    const userObj = await stmt.get(jwtClaims.jti);
    if (userObj === undefined) {
      request.log.info("Auth API: User not found");
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }

    const delStmt = this.db.prepare("UPDATE users SET jwt_id = '' WHERE jwt_id = ?");
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
