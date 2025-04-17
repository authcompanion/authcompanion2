import config from "../../config.js";
import { eq } from "drizzle-orm";
import { refreshCookie } from "../../utils/cookies.js";

export const logoutHandler = async function (request, reply) {
  // Get user ID from validated JWT
  const sub = request.jwtRequestPayload.sub;

  // Invalidate all active tokens by changing JWT ID
  const result = await this.db
    .update(this.users)
    .set({ jwt_id: null })
    .where(eq(this.users.uuid, sub))
    .returning({ uuid: this.users.uuid });

  if (result.length === 0) {
    request.log.warn(`Auth API: Logout attempt for non-existent user (${sub})`);
    throw { statusCode: 404, message: "User not found" };
  }

  // Create expired cookies for both token types
  const expiredRefreshCookie = refreshCookie("", true);

  reply.headers({
    "set-cookie": [expiredRefreshCookie],
    "x-authc-app-origin": config.APPLICATIONORIGIN,
    "Clear-Site-Data": '"cookies", "storage"',
  });

  return reply.code(204).send();
};
