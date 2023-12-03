import config from "../../config.js";
import { randomUUID } from "crypto";
import { createId } from "@paralleldrive/cuid2";
import compadre from "compadre";
import { nouns } from "../../utils/names.js";
import { createHash } from "../../utils/credential.js";
import crypto from "crypto";
import { generateRegistrationOptions } from "@simplewebauthn/server";

export const registrationOptionsHandler = async function (request, reply) {
  try {
    //create a user.id for the new registration
    const userUUID = createId();

    //set the PR's ID value
    const appURL = new URL(config.ORIGIN);
    const rpID = appURL.hostname;

    //build the userName field
    const nameGenerator = new compadre({
      glue: "-",
      nouns: nouns,
    });
    const userName = nameGenerator.generate();

    //build webauthn options for "passwordless" flow.
    let options = {
      rpName: "AuthCompanion",
      rpID,
      userID: userUUID,
      userName: userName,
      timeout: 60000,
      attestationType: "indirect",
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "required",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    //generate registration options to prepare the response
    const generatedOptions = await generateRegistrationOptions(options);

    //Generate user data and create user in database
    //build jwtid
    const jwtid = randomUUID();

    //build password
    //generate a random string of length 16
    const fingerprint = crypto.randomBytes(16).toString("hex");
    const hashpwd = await createHash(fingerprint);

    //build email
    const generatedUniqueEmail = `placeholder+${Math.random().toString(36).substring(8)}@example.com`;

    //create user
    const registerStmt = this.db.prepare(
      "INSERT INTO users (uuid, name, email, password, challenge, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, jwt_id, created_at, updated_at;"
    );
    const userObj = registerStmt.get(
      userUUID,
      userName,
      generatedUniqueEmail,
      hashpwd,
      generatedOptions.challenge,
      "0",
      jwtid
    );
    //send the reply
    return generatedOptions;
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
