import { createHash } from "../../../utils/credential.js";
import { randomUUID } from "crypto";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

export const createUserHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Admin API: The request's type is not set to Users, creation failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists already
    const existingAccount = await this.db
      .select({ uuid: this.users.uuid })
      .from(this.users)
      .where(eq(this.users.email, request.body.data.attributes.email));

    if (existingAccount[0]) {
      request.log.info("Admin API: User's email already exists in database, creation failed");
      throw { statusCode: 400, message: "Duplicate Email Address Exists" };
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

    //Prepare the user account
    const hashPwd = await createHash(request.body.data.attributes.password);
    const uuid = createId();
    const jwtid = randomUUID();
    const now = new Date().toISOString(); // Create a Date object with the current date and time

    const userObj = {
      uuid: uuid,
      name: request.body.data.attributes.name,
      email: request.body.data.attributes.email,
      password: hashPwd,
      active: true,
      isAdmin: request.body.data.attributes.isAdmin,
      metadata: request.body.data.attributes.metadata,
      appdata: request.body.data.attributes.appdata,
      jwt_id: jwtid,
      created_at: now,
      updated_at: now,
    };

    const createdUser = await this.db
      .insert(this.users)
      .values({ ...userObj })
      .returning({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        metadata: this.users.metadata,
        appdata: this.users.appdata,
        active: this.users.active,
        isAdmin: this.users.isAdmin,
        created: this.users.created_at,
        updated: this.users.updated_at,
      });

    reply.statusCode = 201;

    //Send the server reply
    return {
      data: {
        type: "users",
        id: createdUser[0].uuid,
        attributes: { ...createdUser[0] },
      },
    };
  } catch (err) {
    // dont throw error to people
    throw err;
  }
};
