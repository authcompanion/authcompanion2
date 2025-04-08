import config from "../../config.js";
import { eq } from "drizzle-orm";

export const logoutHandler = async function (request, reply) {
  const { uuid } = request.params;

  // Invalidate JWT and verify user exists
  const result = await this.db
    .update(this.users)
    .set({ jwt_id: null })
    .where(eq(this.users.uuid, uuid))
    .returning({ uuid: this.users.uuid });

  if (result.length === 0) {
    request.log.warn(`Admin API: Logout attempt for non-existent user (${uuid})`);
    throw { statusCode: 404, message: "User not found" };
  }

  // Create expired cookie with same attributes as login cookie
  const expiredCookie = [
    "adminRefreshToken=",
    "Path=/",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT", // Expire immediately
    `SameSite=${config.SAMESITE}`,
    "HttpOnly",
    secureCookie(),
  ].join("; ");

  reply.headers({
    "set-cookie": [expiredCookie],
    "x-authc-app-origin": config.ADMIN_ORIGIN,
    "Clear-Site-Data": '"cookies", "storage"',
  });

  reply.code(204).send();
};
