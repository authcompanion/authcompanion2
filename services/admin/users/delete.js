export const deleteUserHandler = async function (request, reply) {
  try {
    //check if the user exists in the database
    const checkUser = this.db.prepare("SELECT * FROM users WHERE uuid = ?;");
    const user = await checkUser.get(request.params.uuid);

    if (!user) {
      request.log.info(
        "Admin API: User does not exist in database, delete failed"
      );
      throw { statusCode: 404, message: "User Not Found" };
    }

    //if the user exists, delete the user from the database
    const stmt = this.db.prepare("DELETE FROM users WHERE uuid = ?");
    const result = await stmt.run(request.params.uuid);

    //send a 204 response
    reply.code(204).send();
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
