import Database from "better-sqlite3";
import config from "../../config.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utilities/jwt.js";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";

export const loginVerificationHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    // Human-readable title for your website
    const rpName = "AuthCompanion";
    // A unique identifier for your website
    const rpID = "localhost";
    // The URL at which registrations and authentications should occur
    const origin = `http://${rpID}:3002`;

    // Fetch user from database
    const stmt = db.prepare("SELECT challenge FROM users WHERE email = ?;");

    const { challenge } = await stmt.get("hello_world@authcompanion.com");

    //verify the request for login
    const verification = await verifyAuthenticationResponse({
      credential: request.body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      //requireUserVerification: true,
    });

    let userObj = {};

    //check if the registration request is verified
    if (!verification.verified) {
      request.log.info("Authenticator was not verified - Registration failed");
      throw { statusCode: 400, message: "Registration Failed" };
    }

    // const { credentialPublicKey, credentialID, counter } =
    //   verification.registrationInfo;

    // const authenticatorStmt = db.prepare(
    //   "INSERT INTO Authenticator (credentialID, credentialPublicKey, counter) VALUES (?,?,?) RETURNING *;"
    // );
    // const authenticatorObj = authenticatorStmt.get(
    //   credentialID,
    //   credentialPublicKey,
    //   counter
    // );
    // console.log(authenticatorObj);

    // const userStmt = db.prepare(
    //   "UPDATE users SET authenticator_id = ? WHERE uuid = '009d3824-f3b9-43d7-aae7-148cfa244124' RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    // );
    // userObj = userStmt.get(authenticatorObj.id);

    // console.log(userObj);

    // //Prepare the reply
    // const userAccessToken = await makeAccesstoken(userObj);
    // const userRefreshToken = await makeRefreshtoken(userObj);

    // const userAttributes = {
    //   name: userObj.name,
    //   email: userObj.email,
    //   created: userObj.created_at,
    //   access_token: userAccessToken.token,
    //   access_token_expiry: userAccessToken.expiration,
    // };
    // const expireDate = new Date();
    // expireDate.setTime(expireDate.getTime() + 7 * 24 * 60 * 60 * 1000); // TODO: Make configurable now, set to 7 days

    // reply.headers({
    //   "set-cookie": `userRefreshToken=${userRefreshToken.token}; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
    //   "x-authc-app-origin": config.APPLICATIONORIGIN,
    // });

    // return {
    //   data: {
    //     id: userObj.uuid,
    //     type: "Login",
    //     attributes: userAttributes,
    //   },
    // };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
