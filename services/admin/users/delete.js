export const deleteUserHandler = async function (request, reply) {
  try {
    //Delete user from the database
    const stmt = this.db.prepare(
      "DELETE FROM users WHERE uuid = ?"
    );
    const users = await stmt.run(request.params.uuid);
    
    //send a 204 response
    reply.code(204).send();

  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
} 