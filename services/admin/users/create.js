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

    //If the user's active status is a string, convert it to a number
    if (request.body.data.attributes.active) {
      if (typeof request.body.data.attributes.active === "string") {
        request.body.data.attributes.active = Number(
          request.body.data.attributes.active
        );
      }
    }

    //Check if the user's active status is being updated and if it is, check if the new status is a valid 1 or 0
    if (request.body.data.attributes.active) {
      if (
        request.body.data.attributes.active !== 0 &&
        request.body.data.attributes.active !== 1
      ) {
        request.log.info(
          "Admin API: User's active status is not valid, update failed"
        );
        throw {
          statusCode: 400,
          message:
            "Invalid Active Status, Please use 1 for true and 0 for false",
        };
      }
    }

    //Create the user in the Database
    const hashpwd = await hashPassword(request.body.data.attributes.password);
    const uuid = randomUUID();
    const jwtid = randomUUID();

    const registerStmt = this.db.prepare(
      "INSERT INTO users (uuid, name, email, password, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, active, created_at, updated_at;"
    );
    const user = registerStmt.get(
      uuid,
      request.body.data.attributes.name,
      request.body.data.attributes.email,
      hashpwd,
      request.body.data.attributes.active,
      jwtid
    );
    //Prepare the server response
    const userAttributes = {
      name: user.name,
      email: user.email,
      active: user.active,
      created: user.created_at,
      updated: user.updated_at,
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
