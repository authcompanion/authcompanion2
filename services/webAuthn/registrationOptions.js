import Database from "better-sqlite3";
import config from "../../config.js";
import { generateRegistrationOptions } from "@simplewebauthn/server";

export const registrationOptionsHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    let opts = {
      rpName: "AuthCompanion",
      rpID: "localhost",
      userID: "009d3824-f3b9-43d7-aae7-148cfa244124",
      userName: "hello_world@authcompanion.com",
      timeout: 60000,
      attestationType: "indirect",
      // /**
      //  * Passing in a user's list of already-registered authenticator IDs here prevents users from
      //  * registering the same device multiple times. The authenticator will simply throw an error in
      //  * the browser if it's asked to perform registration when one of these ID's already resides
      //  * on it.
      //  */
      // excludeCredentials: devices.map((dev) => ({
      //   id: dev.credentialID,
      //   type: "public-key",
      //   transports: dev.transports,
      // })),
      /**
       * The optional authenticatorSelection property allows for specifying more constraints around
       * the types of authenticators that users to can use for registration
       */
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'required',
      },
      /**
       * Support the two most common algorithms: ES256, and RS256
       */
      supportedAlgorithmIDs: [-7, -257],
    };

    //generate registration options
    const generatedOptions = generateRegistrationOptions(opts);

    console.log(generatedOptions);

    //remember the challenge for this user for verification step
    const stmt = db.prepare(
      "UPDATE users SET challenge = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ?;"
    );
    stmt.run(generatedOptions.challenge, "009d3824-f3b9-43d7-aae7-148cfa244124");

    //send the reply
    return generatedOptions;
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
