import config from "../../config.js";
import { randomUUID } from "crypto";
import { generateRegistrationOptions } from "@simplewebauthn/server";

export const registrationOptionsHandler = async function (request, reply) {
  try {
    //create a user.id for the new registration
    const userUUID = randomUUID();

    //set the PR's ID value
    const appURL = new URL(config.ORIGIN);
    const rpID = appURL.hostname;

    //build webauthn options for "passwordless" flow.
    let opts = {
      rpName: "AuthCompanion",
      rpID,
      userID: userUUID,
      userName: `(A username for ${rpID} created at ${new Date().toGMTString()} by Authcompanion)`,
      timeout: 60000,
      attestationType: "indirect",
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "required",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    //generate registration options to prepare the response
    const generatedOptions = generateRegistrationOptions(opts);

    //Create the user in the Database, with some placeholder record information.
    const jwtid = randomUUID();
    const generatedUniqueEmail = randomUUID();

    const registerStmt = this.db.prepare(
      "INSERT INTO users (uuid, name, email, password, challenge, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );
    const userObj = registerStmt.get(
      userUUID,
      "n/a",
      generatedUniqueEmail,
      "n/a",
      generatedOptions.challenge,
      "1",
      jwtid
    );
    //send the reply
    return generatedOptions;
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
