import Database from "better-sqlite3";
import config from "../../config.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utilities/jwt.js";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export const registrationVerificationHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    //set the PR's ID value
    const domain = new URL(config.ORIGIN);
    const rpID = domain.hostname;
    // The URL at which registrations and authentications should occur
    const origin = config.ORIGIN;

    // Fetch user from database
    const requestedAccount = request.headers["x-authc-app-userid"];

    const stmt = db.prepare("SELECT challenge FROM users WHERE UUID = ?;");

    const { challenge } = await stmt.get(requestedAccount);

    //verify the request for registration
    const verification = await verifyRegistrationResponse({
      credential: request.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    //check if the registration request is verified
    if (!verification.verified) {
      request.log.info("Authenticator was not verified - Registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    //create the returned authenticator
    const { credentialPublicKey, credentialID, counter } =
      verification.registrationInfo;

    const authenticatorStmt = db.prepare(
      "INSERT INTO Authenticator (credentialID, credentialPublicKey, counter) VALUES (?,?,?) RETURNING *;"
    );
    const authenticatorObj = authenticatorStmt.get(
      credentialID,
      credentialPublicKey,
      counter
    );

    //associate the authenticator to the user
    const userStmt = db.prepare(
      "UPDATE users SET authenticator_id = ? WHERE uuid = ? RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );

    const userObj = userStmt.get(authenticatorObj.id, requestedAccount);

    //Prepare the reply
    const userAccessToken = await makeAccesstoken(userObj);
    const userRefreshToken = await makeRefreshtoken(userObj);

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
      "set-cookie": `userRefreshToken=${userRefreshToken.token}; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: userObj.uuid,
        type: "Register",
        attributes: userAttributes,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
