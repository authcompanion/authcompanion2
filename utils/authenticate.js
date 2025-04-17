import { validateJWT } from "../utils/jwt.js";
import { parse } from "cookie";

const getAuthToken = (authHeader) => {
  const [_, token] = authHeader?.match(/^Bearer\s+(.*)/) || [];
  if (!token) throw { statusCode: 401, message: "Unauthorized" };
  return token;
};

// Auth API authentication (Bearer token)
export const authenticateAuthRequest = async function (request) {
  const { authorization, cookie } = request.headers;

  const token = getAuthToken(authorization);
  request.jwtRequestPayload = await validateJWT(token, this.key);
};

// Admin API authentication (Bearer token + admin scope)
export const authenticateAdminRequest = async function (request) {
  const { authorization } = request.headers;
  const token = getAuthToken(authorization);
  const payload = await validateJWT(token, this.key);

  if (!payload.scope?.includes("admin")) {
    request.log.info("Missing admin scope");
    throw { statusCode: 401, message: "Unauthorized" };
  }

  request.jwtRequestPayload = payload;
};
