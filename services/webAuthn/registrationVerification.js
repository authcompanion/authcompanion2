import config from "../../config.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { users, authenticator } from "../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

export const registrationVerificationHandler = async function (request, reply) {
  try {
    //set the PR's ID value
    const appURL = new URL(config.ORIGIN);
    const rpID = appURL.hostname;

    // The URL at which registrations and authentications should occur
    const origin = appURL.origin;

    // Fetch user from database
    const requestedAccount = request.headers["x-authc-app-userid"];

    const { challenge } = await this.db
      .select({ challenge: users.challenge })
      .from(users)
      .where(eq(users.uuid, requestedAccount))
      .get();

    //verify the request for registration
    const verification = await verifyRegistrationResponse({
      response: request.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    //check if the registration request is verified
    if (!verification.verified) {
      request.log.info("Authenticator was not verified - Registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    //create the returned authenticator
    const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

    const authenticatorObj = await this.db
      .insert(authenticator)
      .values({
        credentialID: credentialID,
        credentialPublicKey: credentialPublicKey,
        counter: counter,
        transports: request.body.response.transports,
      })
      .returning({ id: authenticator.id });

    //associate the authenticator to the user and activate the account
    const userAcc = await this.db
      .update(users)
      .set({ authenticatorId: authenticatorObj[0].id, active: 1 })
      .where(eq(users.uuid, requestedAccount))
      .returning({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
      });

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(userAcc[0], this.key);
    const userRefreshToken = await makeRefreshtoken(userAcc[0], this.key);

    const userAttributes = {
      name: userAcc.name,
      email: userAcc.email,
      created: userAcc.created_at,
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
        id: userAcc.uuid,
        type: "Register",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw err;
  }
};
