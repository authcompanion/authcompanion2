import Database from "better-sqlite3";
import config from "../../config.js";
import { parse } from "cookie";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const loginOptionsHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    //set the PR's ID value
    const appURL = new URL(config.ORIGIN);
    const rpID = appURL.hostname;

    //set registration options
    const opts = {
      userVerification: "required",
      timeout: 60000,
      rpID,
    };

    //generate options
    const generatedOptions = generateAuthenticationOptions(opts);

    //fetch cookies (we'll need session id. session id is set on page load in ui.routes.js)
    const cookies = parse(request.headers.cookie);

    //persist the challenge with the associated session id for the verification step in loginVerification.js
    const stmt = db.prepare(
      "INSERT INTO storage (sessionID, data) VALUES (?, ?);"
    );
    const userObj = stmt.run(cookies.sessionID, generatedOptions.challenge);

    //send the reply
    return generatedOptions;
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
