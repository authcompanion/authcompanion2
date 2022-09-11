import Database from "better-sqlite3";
import config from "../../config.js";
import { parse } from "cookie";
import { makeAccesstoken, makeRefreshtoken } from "../../utilities/jwt.js";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

export const loginVerificationHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    //set the PR's ID value
    const domain = new URL(config.ORIGIN);
    const rpID = domain.hostname;
    // The URL at which registrations and authentications should occur
    const origin = config.ORIGIN;

    //fetch cookies (we'll need session id. session id is set on page load in ui.routes.js)
    const cookies = parse(request.headers.cookie);

    //retrieve the session's challenge from storage
    const storageStmt = db.prepare(
      "SELECT data FROM storage WHERE sessionID = ?;"
    );
    const sessionChallenge = await storageStmt.get(cookies.sessionID);

    //set userID from response
    const userID = request.body.response.userHandle;

    //retrieve the user's authenticator
    const stmt = db.prepare(
      "SELECT credentialPublicKey, credentialID, counter, transports FROM authenticator INNER JOIN users ON users.authenticator_id = authenticator.id WHERE users.uuid = ?;"
    );
    const userAuthenticator = await stmt.get(userID);

    //verify the request for login with all the information gathered
    const verification = await verifyAuthenticationResponse({
      credential: request.body,
      expectedChallenge: sessionChallenge.data,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: userAuthenticator,
      requireUserVerification: true,
    });

    //check if the registration request is verified
    if (!verification.verified) {
      request.log.info("Authenticator was not verified - Registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    //session clean up in the storage
    const deleteStmt = db.prepare("DELETE FROM storage WHERE sessionID = ?;");
    await deleteStmt.run(cookies.sessionID);

    // All looks good! Let's prepare the reply

    // Fetch user from database
    const userStmt = db.prepare(
      "SELECT uuid, name, email, jwt_id, password, active, created_at, updated_at FROM users WHERE uuid = ?;"
    );
    const userObj = await userStmt.get(userID);

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
      "set-cookie": `userRefreshToken=${userRefreshToken.token}; Path=/; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
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
    throw { statusCode: err.statusCode, message: err.message };
  }
};
