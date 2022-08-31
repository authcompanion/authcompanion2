import Database from "better-sqlite3";
import config from "../../config.js";
import { randomUUID } from "crypto";
import { generateRegistrationOptions } from "@simplewebauthn/server";

export const registrationOptionsHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    //create a user.id for the new registration
    const userUUID = randomUUID();
    //set the PR's ID value
    const rpID = "localhost"

    //build webauthn options for "passwordless" flow. 
    let opts = {
      rpName: "AuthCompanion",
      rpID,
      userID: userUUID,
      userName: `(A username for ${rpID} created at ${Date.now()} by Authcompanion)`,
      timeout: 60000,
      attestationType: "indirect",
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'required',
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    //generate registration options to prepare the response
    const generatedOptions = generateRegistrationOptions(opts);

    //Create the user in the Database, with some placeholder record information. 
    const jwtid = randomUUID();
    const generatedUniqueEmail = randomUUID();

    const registerStmt = db.prepare(
      "INSERT INTO users (uuid, name, email, password, challenge, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );
    const userObj = registerStmt.get(
      userUUID,
      "placeholder",
      generatedUniqueEmail,
      "placeholder",
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
