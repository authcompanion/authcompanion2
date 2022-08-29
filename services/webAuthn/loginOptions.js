import Database from "better-sqlite3";
import config from "../../config.js";
import {
  generateAuthenticationOptions,
} from '@simplewebauthn/server';

export const loginOptionsHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    //generate registration options

    const opts = {
      userVerification: 'required',
      rpID: "localhost",
    };

    const generatedOptions = generateAuthenticationOptions(opts);

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
