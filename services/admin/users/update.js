import { createHash } from "../../../utils/credential.js";
import { users } from "../../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const updateUserHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Admin API: The request's type is not set to Users, update failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists in the database
    const existingAccount = await this.db
      .select({ uuid: users.uuid, email: users.email })
      .from(users)
      .where(eq(users.uuid, request.params.uuid))
      .get();

    if (!existingAccount) {
      request.log.info("Admin API: User does not exist in database, update failed");
      throw { statusCode: 404, message: "User Not Found" };
    }

    //Check if the user's email is being updated and if its not the same email as the user's current email, check if the new email is already in use
    if (request.body.data.attributes.email && request.body.data.attributes.email !== existingAccount.email) {
      const existingEmail = await this.db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, request.body.data.attributes.email))
        .get();

      if (existingEmail) {
        request.log.info("Admin API: User's email is already in use, update failed");
        throw { statusCode: 400, message: "Email Already In Use" };
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

    //Check if the user's isAdmin status is being updated and if it is, check if the new status is a valid 1 or 0
    if (request.body.data.attributes.isAdmin) {
      if (request.body.data.attributes.isAdmin !== 0 && request.body.data.attributes.isAdmin !== 1) {
        request.log.info("Admin API: User's isAdmin status is not valid, update failed");
        throw {
          statusCode: 400,
          message: "Invalid isAdmin Status, Please use 1 for true and 0 for false",
        };
      }
    }

    //If the user's password is being updated, hash the new password
    if (request.body.data.attributes.password) {
      const hashpwd = await createHash(request.body.data.attributes.password);
      request.body.data.attributes.password = hashpwd;
    }

    //Required for drizzle orm to execute sql
    const nameValue = request.body.data.attributes.name || null;
    const emailValue = request.body.data.attributes.email || null;
    const passwordValue = request.body.data.attributes.password || null;
    const metadataValue = JSON.stringify(request.body.data.attributes.metadata) || null;
    const appValue = JSON.stringify(request.body.data.attributes.appdata) || null;
    const activeValue = request.body.data.attributes.active ?? null;
    const adminValue = request.body.data.attributes.isAdmin ?? null;

    //Per json-api spec: If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.
    const stmt = sql`
    UPDATE users
    SET
      name = coalesce(${nameValue}, name),
      email = coalesce(${emailValue}, email),
      password = coalesce(${passwordValue}, password),
      metadata = coalesce(${metadataValue}, metadata),
      appdata = coalesce(${appValue}, appdata),
      active = coalesce(${activeValue}, active),
      isAdmin = coalesce(${adminValue}, isAdmin)
    WHERE uuid = ${request.params.uuid}
    RETURNING uuid, name, email, password, metadata, appdata, active, isAdmin, created_at, updated_at;
  `;

    const user = this.db.get(stmt);

    //Prepare the server response
    const userAttributes = {
      name: user.name,
      email: user.email,
      metadata: JSON.parse(user.metadata),
      app: JSON.parse(user.appdata),
      active: user.active,
      isAdmin: user.isAdmin,
      created: user.created_at,
      updated: user.updated_at,
    };

    reply.statusCode = 200;

    //Send the server reply
    return {
      data: {
        type: "users",
        id: user.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
