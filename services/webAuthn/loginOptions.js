import Database from "better-sqlite3";
import config from "../../config.js";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const loginOptionsHandler = async (request, reply) => {
  try {
    const db = new Database(config.DBPATH);

    //set the PR's ID value
    const domain = new URL(config.ORIGIN);
    const rpID = domain.hostname;

    //generate registration options
    const opts = {
      userVerification: "required",
      timeout: 60000,
      rpID,
    };

    const generatedOptions = generateAuthenticationOptions(opts);

    //send the reply
    return generatedOptions;
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
