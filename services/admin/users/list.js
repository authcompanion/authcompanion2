export const listUsersHandler = async function (request, reply) {
  try {
    //Fetch the user's uuid, name, email, active and created_at, updated_at attributes from the database
    const stmt = this.db.prepare(
      "SELECT uuid, name, email, active, created_at, updated_at FROM users"
    );
    const users = await stmt.all();

    //For each user, prepare the server response
    const userAttributes = users.map((user) => {
      return {
        type: "users",
        id: user.uuid,
        attributes: {
          name: user.name,
          email: user.email,
          active: user.active,
          created: user.created_at,
          updated: user.updated_at,
        },
      };
    });

    //Send the server reply
    reply.statusCode = 200;
    return {
      data: userAttributes,
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
