import config from "../../config.js";
import { createId } from "@paralleldrive/cuid2";
import compadre from "compadre";
import { nouns } from "../../utils/names.js";
import { createHash } from "../../utils/credential.js";
import crypto from "crypto";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { users } from "../../db/sqlite/schema.js";
import { eq, sql } from "drizzle-orm";

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
    console.log(userName);

    //build webauthn options for "passwordless" flow.
    let options = {
      rpName: "AuthCompanion",
      rpID,
      userID: userUUID,
      userName: userName,
      timeout: 60000,
      attestationType: "indirect",
      authenticatorSelection: {
        userVerification: "preferred",
        residentKey: "required",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    //generate registration options to prepare the response
    const generatedOptions = await generateRegistrationOptions(options);

    //Generate user data and create user in database

    //build password
    //generate a random string of length 16
    const fingerprint = crypto.randomBytes(16).toString("hex");
    const hashpwd = await createHash(fingerprint);

    //build email
    const generatedUniqueEmail = `placeholder+${Math.random().toString(36).substring(8)}@example.com`;

    //create user
    await this.db.insert(users).values({
      uuid: userUUID,
      name: userName,
      email: generatedUniqueEmail,
      password: hashpwd,
      challenge: generatedOptions.challenge,
      active: 0,
      created_at: sql`DATETIME('now')`,
    });

    //send the reply
    return generatedOptions;
  } catch (err) {
    throw err;
  }
};
