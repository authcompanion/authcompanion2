import { makeAdminToken, makeAdminRefreshtoken, validateJWT } from "../../utils/jwt.js";
import config from "../../config.js";
import { eq } from "drizzle-orm";
import { secureCookie } from "../../utils/credential.js";

export const tokenRefreshHandler = async function (request, reply) {
  const { refreshToken } = request.body;

  if (!refreshToken) {
    request.log.warn("Admin API: Missing refresh token in request");
    throw { statusCode: 400, message: "Refresh token required" };
  }

  // Validate and decode refresh token
  const claims = await validateJWT(refreshToken, this.key);

  // Fetch user with matching token ID
  const [user] = await this.db
    .select({
      uuid: this.users.uuid,
      name: this.users.name,
      email: this.users.email,
      active: this.users.active,
      isAdmin: this.users.isAdmin,
    })
    .from(this.users)
    .where(eq(this.users.jwt_id, claims.jti));

  if (!user) {
    request.log.warn(`Admin API: Invalid refresh token attempt (JTI: ${claims.jti})`);
    throw { statusCode: 401, message: "Invalid refresh token" };
  }

  if (!user.active) {
    request.log.warn(`Admin API: Refresh attempt for inactive user (${user.email})`);
    throw { statusCode: 403, message: "Account inactive" };
  }

  if (user.isAdmin !== true) {
    request.log.warn(`Admin API: Non-admin refresh attempt (${user.email})`);
    throw { statusCode: 403, message: "Access denied" };
  }

  // Generate new tokens
  const accessToken = await makeAdminToken(user, this.key);
  const newRefreshToken = await makeAdminRefreshtoken(user, this.key, this);

  // Build cookie header manually
  const cookieExpiry = new Date(Date.now() + config.ADMIN_REFRESH_TOKEN_TTL * 1000);
  const accessCookie = [
    `adminRefreshToken=${newRefreshToken.token}`,
    "Path=/",
    `Expires=${cookieExpiry.toUTCString()}`,
    `SameSite=${config.SAMESITE}`,
    "HttpOnly",
    secureCookie(),
  ].join("; ");

  reply.headers({
    "set-cookie": [accessCookie],
    "x-authc-app-origin": config.ADMIN_ORIGIN,
  });

  return {
    data: {
      id: user.uuid,
      type: "users",
      attributes: {
        name: user.name,
        email: user.email,
        access_token_expiry: accessToken.expiration,
      },
    },
  };
};

export const tokenRefreshDeleteHandler = async function (request, reply) {
  const { refreshToken } = request.body;

  if (!refreshToken) {
    request.log.warn("Admin API: Missing refresh token in revocation request");
    throw { statusCode: 400, message: "Refresh token required" };
  }

  const claims = await validateJWT(refreshToken, this.key);

  // Invalidate all tokens for this session
  await this.db.update(this.users).set({ jwt_id: null }).where(eq(this.users.jwt_id, claims.jti));

  // Build expired cookie header
  const expiredCookie = [
    "adminRefreshToken=",
    "Path=/",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    `SameSite=${config.SAMESITE}`,
    "HttpOnly",
    secureCookie(),
  ].join("; ");

  reply
    .code(204)
    .headers({
      "set-cookie": [expiredCookie],
      "x-authc-app-origin": config.ADMIN_ORIGIN,
    })
    .send();
};
