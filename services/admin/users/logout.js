import config from "../../../config.js";

export const logoutHandler = async function (request, reply) {
  try {
    const jwtPayload = request.jwtRequestPayload;
    const userId = jwtPayload.userid;

    //Check if the user exists in the database
    const stmt = this.db.prepare(
      "UPDATE admin SET jwt_id = NULL WHERE uuid = ?;"
    );
    const result = await stmt.run(userId);

    reply.headers({
      "x-authc-app-origin": config.ADMINORIGIN,
    });

    return {
      logout: true,
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: "Server Error" };
  }
};
