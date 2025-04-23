import { randomUUID } from "crypto";
import config from "../../config.js";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const loginOptionsHandler = async function (request, reply) {
  try {
    const rpID = new URL(config.ORIGIN).hostname;
    const sessionID = randomUUID();

    const options = await generateAuthenticationOptions({
      userVerification: "preferred",
      timeout: 60000,
      rpID,
    });

    await this.db.insert(this.storage).values({
      sessionID,
      data: options.challenge,
    });

    return {
      ...options,
      sessionID,
    };
  } catch (err) {
    throw { statusCode: err.statusCode || 500, message: err.message };
  }
};
