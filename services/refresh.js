import {
  makeAccesstoken,
  makeRefreshtoken,
  validateJWT,
} from "../utilities/jwt.js";
import config from "../config.js";
import { parse } from "cookie";

export const tokenRefreshHandler = async function (request, reply) {
  try {
    let requestToken = {};

    //Check if the request includes a refresh token in the header or in the request body
    if (request.body) {
      requestToken = request.body.token;
    } else if (request.headers.cookie) {
      const cookies = parse(request.headers.cookie);
      requestToken = cookies.userRefreshToken;
    } else {
      request.log.info(
        "Request did not have cookie or token - Refresh Token Failed"
      );
      throw { statusCode: 400, message: "Refresh Token Failed" };
    }
    //Validate the refresh token
    const jwtClaims = await validateJWT(requestToken);

    //Fetch user from Database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, jwt_id, created_at, updated_at FROM users WHERE jwt_id = ?;"
    );
    const userObj = await stmt.get(jwtClaims.jti);

    //Prepare the reply
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
        type: "Refresh",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
