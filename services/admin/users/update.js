import { createHash } from "../../../utils/credential.js";

export const updateUserHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Admin API: The request's type is not set to Users, update failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists in the database
    const userStmt = this.db.prepare("SELECT * FROM users WHERE uuid = ?;");
    const user = await userStmt.get(request.params.uuid);

    if (!user) {
      request.log.info("Admin API: User does not exist in database, update failed");
      throw { statusCode: 404, message: "User Not Found" };
    }

    //Check if the user's email is being updated and if its not the same email as the user's current email, check if the new email is already in use
    if (request.body.data.attributes.email && request.body.data.attributes.email !== user.email) {
      const emailStmt = this.db.prepare("SELECT * FROM users WHERE email = ?;");
      const email = await emailStmt.get(request.body.data.attributes.email);

      if (email) {
        request.log.info("Admin API: User's email is already in use, update failed");
        throw { statusCode: 400, message: "Email Already In Use" };
      }
    }

    //if the user's password is being updated, hash the new password
    if (request.body.data.attributes.password) {
      const hashpwd = await createHash(request.body.data.attributes.password);
      request.body.data.attributes.password = hashpwd;
    }

    //If the user's active status is a string, convert it to a number
    if (request.body.data.attributes.active) {
      if (typeof request.body.data.attributes.active === "string") {
        request.body.data.attributes.active = Number(request.body.data.attributes.active);
      }
    }

    //Check if the user's active status is being updated and if it is, check if the new status is a valid 1 or 0
    if (request.body.data.attributes.active) {
      if (request.body.data.attributes.active !== 0 && request.body.data.attributes.active !== 1) {
        request.log.info("Admin API: User's active status is not valid, update failed");
        throw {
          statusCode: 400,
          message: "Invalid Active Status, Please use 1 for true and 0 for false",
        };
      }
    }

    //Per json-api spec: If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.
    const updateStmt = this.db.prepare(
      "UPDATE users SET name = coalesce(?, name), email = coalesce(?, email), password = coalesce(?, password), metadata = coalesce(?, metadata), appdata = coalesce(?, appdata), active = coalesce(?, active), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ? RETURNING uuid, name, email, metadata, appdata, active, created_at, updated_at;"
    );
    const updatedUser = updateStmt.get(
      request.body.data.attributes.name,
      request.body.data.attributes.email,
      request.body.data.attributes.password,
      JSON.stringify(request.body.data.attributes.metadata),
      JSON.stringify(request.body.data.attributes.app),
      request.body.data.attributes.active,
      request.params.uuid
    );

    //Prepare the server response
    const userAttributes = {
      name: updatedUser.name,
      email: updatedUser.email,
      metadata: JSON.parse(user.metadata),
      app: JSON.parse(user.appdata),
      active: updatedUser.active,
      created: updatedUser.created_at,
      updated: updatedUser.updated_at,
    };

    reply.statusCode = 200;

    //Send the server reply
    return {
      data: {
        type: "users",
        id: updatedUser.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
