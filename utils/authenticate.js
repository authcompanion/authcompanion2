import { validateJWT } from "./jwt.js";
import { parse } from "cookie";

// Used for user authentication (auth api) - uses bearer token in header
export const authenticateAuthRequest = async function (request, reply) {
  try {
    const authHeader = request.headers.authorization;

    const requestToken = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : (() => {
          throw { statusCode: "401", message: "Unauthorized" };
        })();
    //extract the specific fingerprint value from the header
    const cookies = parse(request.headers.cookie);
    const fingerPrint = cookies["Fgp"];

    //validate the JWT
    const payload = await validateJWT(requestToken, this.key, fingerPrint);

    //set the request context
    request.jwtRequestPayload = payload;
  } catch (error) {
    throw { statusCode: "401", message: "Unauthorized" };
  }
};
// Used for user authentication (admin api) - uses bearer token in header and checks for admin scope
export const authenticateAdminRequest = async function (request, reply) {
  try {
    const authHeader = request.headers.authorization;

    const requestToken = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : (() => {
          throw { statusCode: "401", message: "Unauthorized" };
        })();

    //validate the JWT
    const payload = await validateJWT(requestToken, this.key);

    //check the jwt payload in the scope claim for admin
    if (!payload.scope.includes("admin")) {
      request.log.info("Missing admin scope in token");
      throw { statusCode: "401", message: "Unauthorized" };
    }

    //set the request context
    request.jwtRequestPayload = payload;
  } catch (error) {
    throw { statusCode: "401", message: "Unauthorized" };
  }
};
// User for admin authentication (admin UI) - uses cookie in browser and checks for admin scope
export const authenticateWebAdminRequest = async function (request, reply) {
  try {
    const cookies = parse(request.headers.cookie);

    // Check if adminAccessToken token exists in the cookies
    if (!cookies.adminAccessToken) {
      reply.redirect("/v1/admin/login");
      throw { statusCode: "401", message: "Unauthorized, Please Login" };
    }

    // Validate the adminAccessToken token and get its payload
    const fingerPrint = cookies["Fgp"];
    const payload = await validateJWT(cookies.adminAccessToken, this.key, fingerPrint);

    // Check if the payload contains the admin scope
    if (!payload.scope.includes("admin")) {
      reply.redirect("/v1/admin/login");
      throw { statusCode: "401", message: "Unauthorized, Please Login" };
    }

    // Set the request with the JWT payload
    request.jwtRequestPayload = payload;
  } catch (error) {
    // If an error occurs, redirect to the login page and throw an unauthorized error
    reply.redirect("/v1/admin/login");
    throw { statusCode: "401", message: "Unauthorized, Please Login" };
  }
};
