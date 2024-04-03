import { eq } from "drizzle-orm";

export const deleteUserHandler = async function (request, reply) {
  try {
    //check if the user exists in the database
    const existingAccount = await this.db
      .select({ uuid: this.users.uuid })
      .from(this.users)
      .where(eq(this.users.uuid, request.params.uuid));

    if (existingAccount.length === 0) {
      request.log.info("Admin API: User does not exist in database, delete failed");
      throw { statusCode: 404, message: "User Not Found" };
    }

    //if the user exists, delete the user from the database
    await this.db.delete(this.users).where(eq(this.users.uuid, request.params.uuid));

    //send a 204 response
    reply.code(204).send();
  } catch (err) {
    throw err;
  }
};
