import { createHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { refreshCookie, fgpCookie } from "../../utils/cookies.js";
import { users } from "../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const userProfileHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, update failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Fetch user from Database
    const existingAccount = await this.db
      .select({ uuid: users.uuid, email: users.email })
      .from(users)
      .where(eq(users.uuid, request.jwtRequestPayload.userid))
      .get();

    //Check if the user exists already
    if (!existingAccount) {
      request.log.info("Auth API: User does not exist in database, update failed");
      throw { statusCode: 400, message: "Profile Update Failed" };
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

    //if the user's password is being updated, hash the new password
    if (request.body.data.attributes.password) {
      const hashpwd = await createHash(request.body.data.attributes.password);
      request.body.data.attributes.password = hashpwd;
    }

    //Required for drizzle orm to execute sql
    const nameValue = request.body.data.attributes.name || null;
    const emailValue = request.body.data.attributes.email || null;
    const passwordValue = request.body.data.attributes.password || null;

    //Per json-api spec: If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.
    const stmt = sql`
    UPDATE users
    SET
      name = coalesce(${nameValue}, name),
      email = coalesce(${emailValue}, email),
      password = coalesce(${passwordValue}, password)
    WHERE uuid = ${request.jwtRequestPayload.userid}
    RETURNING uuid, name, email, metadata, appdata, active, created_at, updated_at;
  `;

    const user = this.db.get(stmt);

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(user, this.key);
    const userRefreshToken = await makeRefreshtoken(user, this.key);

    const userAttributes = {
      name: user.name,
      email: user.email,
      created: user.created_at,
      updated: user.updated_at,
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
        id: user.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
