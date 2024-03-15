import { users } from "../../../db/sqlite/schema.js";
import { eq } from "drizzle-orm";

export const deleteUserHandler = async function (request, reply) {
  try {
    //check if the user exists in the database
    const existingAccount = await this.db
      .select({ uuid: users.uuid })
      .from(users)
      .where(eq(users.uuid, request.params.uuid))
      .get();

    if (!existingAccount) {
      request.log.info("Admin API: User does not exist in database, delete failed");
      throw { statusCode: 404, message: "User Not Found" };
    }

    //if the user exists, delete the user from the database
    await this.db.delete(users).where(eq(users.uuid, request.params.uuid));

    //send a 204 response
    reply.code(204).send();
  } catch (err) {
    throw err;
  }
};
