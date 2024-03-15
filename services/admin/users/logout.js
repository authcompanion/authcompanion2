import config from "../../../config.js";
import { users } from "../../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const logoutHandler = async function (request, reply) {
  try {
    await this.db.update(users).set({ jwt_id: null }).where(eq(users.uuid, request.params.uuid));

    reply.headers({
      "set-cookie": [`adminDashboardAccessToken=; Path=/; Expires=;`],
      "x-authc-app-origin": config.ADMINORIGIN,
    });

    reply.code(204);
  } catch (err) {
    throw err;
  }
};
