import { validateJWT } from "./jwt.js";
import { parse } from "cookie";

// Used for user authentication (auth api) - uses bearer token in header
export const authenticateAuthRequest = async function (request, reply) {
  let requestToken = {};
  try {
    //check if the request includes an authorization header
    if (request.headers.authorization.startsWith("Bearer ")) {
      //extract the specific token value from the header
      requestToken = request.headers.authorization.substring(
        7,
        request.headers.authorization.length
      );
    } else {
      request.log.info("Missing access token in header");
      throw { statusCode: "401", message: "Unauthorized" };
    }
    //validate the token
    const payload = await validateJWT(requestToken, this.key);
    //set request with jwt payload
    request.jwtRequestPayload = payload;
  } catch (error) {
    throw { statusCode: "401", message: "Unauthorized" };
  }
};

// Used for user authentication (admin apu) - uses bearer token in header and checks for admin scope
export const authenticateAdminRequest = async function (request, reply) {
  let requestToken = {};
  try {
    //check if the request includes an authorization header
    if (request.headers.authorization.startsWith("Bearer ")) {
      //extract the specific token value from the header
      requestToken = request.headers.authorization.substring(
        7,
        request.headers.authorization.length
      );
    } else {
      request.log.info("Missing access token in header");
      throw { statusCode: "401", message: "Unauthorized" };
    }
    //validate the token
    const payload = await validateJWT(requestToken, this.key);
    //check the jwt payload in the scope claim for admin
    if (!payload.scope.includes("admin")) {
      request.log.info("Missing admin scope in token");
      throw { statusCode: "401", message: "Unauthorized" };
    }
    //set request with jwt payload
    request.jwtRequestPayload = payload;
  } catch (error) {
    throw { statusCode: "401", message: "Unauthorized" };
  }
};

// Used for admin authentication (web) - uses cookie instead of bearer token in header
export const authenticateWebAdminRequest = async function (request, reply) {
  let requestToken = {};
  try {
    //check if the request includes header cookie
    if (request.headers.cookie) {
      //extract the specific token value from the header
      const cookies = parse(request.headers.cookie);
      requestToken = cookies.adminAccessToken;
    } else {
      request.log.info("Missing admin token in header");
      reply.redirect("/v1/admin/login");
      throw { statusCode: "401", message: "Unauthorized, Please Login" };
    }
    //validate the token
    const payload = await validateJWT(requestToken, this.key);
    //check the jwt payload in the scope claim for admin
    if (!payload.scope.includes("admin")) {
      request.log.info("Missing admin scope in token");
      reply.redirect("/v1/admin/login");
      throw { statusCode: "401", message: "Unauthorized, Please Login" };
    }
    //set request with jwt payload
    request.jwtRequestPayload = payload;
  } catch (error) {
    reply.redirect("/v1/admin/login");
    throw { statusCode: "401", message: "Unauthorized, Please Login" };
  }
};
