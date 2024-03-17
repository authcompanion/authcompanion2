import { createHash, secureCookie } from "../../utils/credential.js";
import { randomUUID } from "crypto";
import { createId } from "@paralleldrive/cuid2";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { refreshCookie, fgpCookie } from "../../utils/cookies.js";
import { users } from "../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const registrationHandler = async function (request, reply) {
  try {
    //Check the request's type attibute is set to users
    if (request.body.data.type !== "users") {
      request.log.info("Auth API: The request's type is not set to Users, registration failed");
      throw { statusCode: 400, message: "Invalid Type Attribute" };
    }

    //Check if the user exists already
    const existingAccount = await this.db
      .select({ uuid: users.uuid })
      .from(users)
      .where(eq(users.email, request.body.data.attributes.email))
      .get();

    if (existingAccount) {
      request.log.info("Auth API: User already exists in database, registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    //Create the user in the Database
    const hashPwd = await createHash(request.body.data.attributes.password);
    const uuid = createId();
    const jwtid = randomUUID();

    const userObj = {
      uuid: uuid,
      name: request.body.data.attributes.name,
      email: request.body.data.attributes.email,
      password: hashPwd,
      active: 1,
      metadata: request.body.data.attributes.metadata,
      jwt_id: jwtid,
      created_at: sql`DATETIME('now')`,
    };

    const createdUser = await this.db
      .insert(users)
      .values({ ...userObj })
      .returning({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        active: users.active,
        metadata: users.metadata,
        created: users.created_at,
        updated: users.updated_at,
      });

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(createdUser, this.key);
    const userRefreshToken = await makeRefreshtoken(createdUser, this.key);

    const userAttributes = {
      name: createdUser[0].name,
      email: createdUser[0].email,
      created: createdUser[0].created_at,
      access_token: userAccessToken.token,
      access_token_expiry: userAccessToken.expiration,
    };
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days

    reply.headers({
      "set-cookie": [refreshCookie(userRefreshToken.token), fgpCookie(userAccessToken.userFingerprint)],
      "x-authc-app-origin": config.REGISTRATIONORIGIN,
    });

    reply.statusCode = 201;

    return {
      data: {
        type: "users",
        id: createdUser.uuid,
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
