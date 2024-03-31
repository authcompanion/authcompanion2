import config from "../../config.js";
import { parse } from "cookie";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";

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
        data: this.storage.data,
      })
      .from(this.storage)
      .where(eq(this.storage.sessionID, cookies.sessionID));

    //set userID from response
    const userID = request.body.response.userHandle;

    //retrieve the user's authenticator
    const userAuthenticator = await this.db
      .select({
        credentialPublicKey: this.authenticator.credentialPublicKey,
        credentialID: this.authenticator.credentialID,
        counter: this.authenticator.counter,
        transports: this.authenticator.transports,
      })
      .from(this.authenticator)
      .innerJoin(this.users, eq(this.users.authenticatorId, this.authenticator.id))
      .where(eq(this.users.uuid, userID));

    //verify the request for login with all the information gathered
    const verification = await verifyAuthenticationResponse({
      response: request.body,
      expectedChallenge: sessionChallenge[0].data,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: userAuthenticator[0],
      requireUserVerification: false,
    });

    console.log(verification);

    //check if the registration request is verified
    if (!verification.verified) {
      request.log.info("Authenticator was not verified - Registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    //session clean up in the storage
    await this.db.delete(this.storage).where(eq(this.storage.sessionID, this.cookies.sessionID));

    // All looks good! Let's prepare the reply

    // Fetch user from database
    const userObj = await this.db
      .select({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        jwt_id: this.users.jwt_id,
        active: this.users.active,
        created_at: this.users.created_at,
      })
      .from(this.users)
      .where(eq(this.users.uuid, userID));

    const userAccessToken = await makeAccesstoken(userObj[0], this.key);
    const userRefreshToken = await makeRefreshtoken(userObj[0], this.key, this);

    const userAttributes = {
      name: userObj[0].name,
      email: userObj[0].email,
      created: userObj[0].created_at,
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
        id: userObj[0].uuid,
        type: "Login",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
