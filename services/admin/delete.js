import { eq } from "drizzle-orm";

export const deleteUserHandler = async function (request, reply) {
  const { uuid } = request.params;

  // // Prevent self-deletion
  // if (request.user?.uuid === uuid) {
  //   request.log.warn(`Admin API: Self-deletion attempt (${uuid})`);
  //   throw {
  //     statusCode: 403,
  //     message: "Self-deletion is not permitted",
  //   };
  // }

  // Perform conditional delete
  const deletionResult = await this.db
    .delete(this.users)
    .where(eq(this.users.uuid, uuid))
    .returning({ deletedUuid: this.users.uuid });

  if (deletionResult.length === 0) {
    request.log.warn(`Admin API: Delete attempt for non-existent user (${uuid})`);
    throw { statusCode: 404, message: "User not found" };
  }

  // Log successful deletion
  request.log.info(`Admin API: User ${uuid} deleted successfully`);

  // Send proper 204 response
  reply.status(204).send();
};
