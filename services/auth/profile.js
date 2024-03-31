import { createHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { refreshCookie, fgpCookie } from "../../utils/cookies.js";
import { eq } from "drizzle-orm";

export const userProfileHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, update failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Fetch user from Database
    const existingAccount = await this.db
      .select({
        name: this.users.name,
        email: this.users.email,
      })
      .from(this.users)
      .where(eq(this.users.uuid, request.jwtRequestPayload.userid));

    //Check if the user exists already
    if (!existingAccount) {
      request.log.info("Auth API: User does not exist in database, update failed");
      throw { statusCode: 400, message: "Profile Update Failed" };
    }

    //Check if the user's email is being updated and if its not the same email as the user's current email, check if the new email is already in use
    if (request.body.data.attributes.email && request.body.data.attributes.email !== existingAccount.email) {
      const existingEmail = await this.db
        .select({ email: this.users.email })
        .from(this.users)
        .where(eq(this.users.email, request.body.data.attributes.email));

      if (existingEmail) {
        request.log.info("Admin API: User's email is already in use, update failed");
        throw { statusCode: 400, message: "Email Already In Use" };
      }
    }

    //if the user's password is being updated, hash the new password
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
      updated_at: now,
    };

    const user = await this.db
      .update(this.users)
      .set(updateData)
      .where(eq(this.users.uuid, request.jwtRequestPayload.userid))
      .returning({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        metadata: this.users.metadata,
        active: this.users.active,
        created_at: this.users.created_at,
        updated_at: this.users.updated_at,
      });

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(user[0], this.key);
    const userRefreshToken = await makeRefreshtoken(user[0], this.key, this);

    const userAttributes = {
      name: user[0].name,
      email: user[0].email,
      created: user[0].created_at,
      updated: user[0].updated_at,
      access_token: userAccessToken.token,
      access_token_expiry: userAccessToken.expiration,
    };

    reply.headers({
      "set-cookie": [refreshCookie(userRefreshToken.token), fgpCookie(userAccessToken.userFingerprint)],
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

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
