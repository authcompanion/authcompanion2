import config from "../../config.js";
import { parse } from "cookie";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const loginOptionsHandler = async function (request, reply) {
  try {
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
    const generatedOptions = await generateAuthenticationOptions(opts);

    //fetch cookies (we'll need session id. session id is set on page load in ui.routes.js)
    const cookies = parse(request.headers.cookie);

    //persist the challenge with the associated session id for the verification step in loginVerification.js
    const stmt = this.db.prepare("INSERT INTO storage (sessionID, data) VALUES (?, ?);");
    await stmt.run(cookies.sessionID, generatedOptions.challenge);

    //send the reply
    return generatedOptions;
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
