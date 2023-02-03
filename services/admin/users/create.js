import { hashPassword } from "../../../utilities/credential.js";
import { randomUUID } from "crypto";

export const createUserHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info(
        "Admin API: The request's type is not set to Users, creation failed"
      );
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user's email exists already
    const stmt = this.db.prepare("SELECT * FROM users WHERE email = ?;");
    const duplicateAccount = await stmt.get(request.body.data.attributes.email);

    if (duplicateAccount) {
      request.log.info(
        "Admin API: User's email already exists in database, creation failed"
      );
      throw { statusCode: 400, message: "Duplicate Email Address Exists" };
    }
    //Create the user in the Database
    const hashpwd = await hashPassword(request.body.data.attributes.password);
    const uuid = randomUUID();
    const jwtid = randomUUID();

    const registerStmt = this.db.prepare(
      "INSERT INTO users (uuid, name, email, password, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );
    const user = registerStmt.get(
      uuid,
      request.body.data.attributes.name,
      request.body.data.attributes.email,
      hashpwd,
      "1",
      jwtid
    );
    //Prepare the server response
    const userAttributes = {
      name: user.name,
      email: user.email,
      created: user.created_at,
    };

    reply.statusCode = 201;

    //Send the server reply
    return {
      data: {
        type: "users",
        id: user.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
