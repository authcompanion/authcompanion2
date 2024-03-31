import { createHash } from "../../../utils/credential.js";
import { eq } from "drizzle-orm";

export const updateUserHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Admin API: The request's type is not set to Users, update failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists in the database
    const existingAccount = await this.db
      .select({
        name: this.users.name,
        email: this.users.email,
        metadata: this.users.metadata,
        appdata: this.users.appdata,
        isAdmin: this.users.isAdmin,
        active: this.users.active,
      })
      .from(this.users)
      .where(eq(this.users.uuid, request.params.uuid));

    if (!existingAccount[0]) {
      request.log.info("Admin API: User does not exist in database, update failed");
      throw { statusCode: 404, message: "User Not Found" };
    }

    //Check if the user's email is being updated and if its not the same email as the user's current email, check if the new email is already in use
    if (request.body.data.attributes.email && request.body.data.attributes.email !== existingAccount.email) {
      const existingEmail = await this.db
        .select({ email: this.users.email })
        .from(this.users)
        .where(eq(this.users.email, request.body.data.attributes.email));

      if (existingEmail[0]) {
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

    const data = request.body.data.attributes;
    const now = new Date().toISOString(); // Create a Date object with the current date and time

    const updateData = {
      name: data.name ?? existingAccount[0].name,
      email: data.email ?? existingAccount[0].email,
      password: data.password ?? request.body.data.attributes.password,
      metadata: data.metadata ?? existingAccount[0].metadata,
      appdata: data.appdata ?? existingAccount[0].appdata,
      active: Boolean(data.active ?? existingAccount[0].active),
      isAdmin: Boolean(data.isAdmin ?? existingAccount[0].isAdmin),
      updated_at: now,
    };

    const user = await this.db
      .update(this.users)
      .set(updateData)
      .where(eq(this.users.uuid, request.params.uuid))
      .returning({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        metadata: this.users.metadata,
        appdata: this.users.appdata,
        isAdmin: this.users.isAdmin,
        active: this.users.active,
        created_at: this.users.created_at,
        updated_at: this.users.updated_at,
      });

    //Prepare the server response
    const userAttributes = {
      name: user[0].name,
      email: user[0].email,
      metadata: user[0].metadata,
      app: user[0].appdata,
      active: user[0].active,
      isAdmin: user[0].isAdmin,
      created: user[0].created_at,
      updated: user[0].updated_at,
    };

    reply.statusCode = 200;

    //Send the server reply
    return {
      data: {
        type: "users",
        id: user[0].uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
