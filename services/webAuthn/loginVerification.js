import config from "../../config.js";
import { parse } from "cookie";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { users, storage, authenticator } from "../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const loginVerificationHandler = async function (request, reply) {
  try {
    //set the PR's ID value
    const appURL = new URL(config.ORIGIN);

    const rpID = appURL.hostname;
    // The URL at which registrations and authentications should occur
    const origin = appURL.origin;

    //fetch cookies (we'll need session id. session id is set on page load in ui.routes.js)
    const cookies = parse(request.headers.cookie);

    //retrieve the session's challenge from storage
    const sessionChallenge = await this.db
      .select({
        data: storage.data,
      })
      .from(storage)
      .where(eq(storage.sessionID, cookies.sessionID))
      .get();

    //set userID from response
    const userID = request.body.response.userHandle;

    //retrieve the user's authenticator
    const userAuthenticator = await this.db
      .select({
        credentialPublicKey: authenticator.credentialPublicKey,
        credentialID: authenticator.credentialID,
        counter: authenticator.counter,
        transports: authenticator.transports,
      })
      .from(authenticator)
      .innerJoin(users, eq(users.authenticatorId, authenticator.id))
      .where(eq(users.uuid, userID))
      .get();

    //verify the request for login with all the information gathered
    const verification = await verifyAuthenticationResponse({
      response: request.body,
      expectedChallenge: sessionChallenge.data,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: userAuthenticator,
      requireUserVerification: false,
    });

    //check if the registration request is verified
    if (!verification.verified) {
      request.log.info("Authenticator was not verified - Registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    //session clean up in the storage
    await this.db.delete(storage).where(eq(storage.sessionID, cookies.sessionID)).run();

    // All looks good! Let's prepare the reply

    // Fetch user from database
    const userObj = await this.db
      .select({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
        jwt_id: users.jwt_id,
        active: users.active,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.uuid, userID))
      .get();

    const userAccessToken = await makeAccesstoken(userObj, this.key);
    const userRefreshToken = await makeRefreshtoken(userObj, this.key);

    const userAttributes = {
      name: userObj.name,
      email: userObj.email,
      created: userObj.created_at,
      access_token: userAccessToken.token,
      access_token_expiry: userAccessToken.expiration,
    };
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days

    reply.headers({
      "set-cookie": [
        `userRefreshToken=${userRefreshToken.token}; Path=/; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
        `Fgp=${userAccessToken.userFingerprint}; Path=/; Max-Age=7200; SameSite=None; Secure; HttpOnly`,
      ],
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: userObj.uuid,
        type: "Login",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
