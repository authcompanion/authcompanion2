import config from "../../config.js";
import { init } from "@paralleldrive/cuid2";
import { createHash } from "../../utils/credential.js";
import crypto from "crypto";
import { generateRegistrationOptions } from "@simplewebauthn/server";

const createId = init({ length: 10 });

export const registrationOptionsHandler = async function (request, reply) {
  try {
    const { name: userName, email: userEmail } = request.body;

    if (!userName || !userEmail) {
      return reply.code(400).send({ error: "Name and email are required" });
    }

    const userUUID = createId();
    const appURL = new URL(config.ORIGIN);
    const rpID = appURL.hostname;

    // Generate secure random password (not shown to user)
    const passwordBuffer = crypto.randomBytes(32); // 256 bits entropy
    const rawPassword = passwordBuffer
      .toString("base64")
      .replace(/[+/=]/g, "") // Remove special characters
      .slice(0, 24); // 24-character password
    const hashedPassword = await createHash(rawPassword);

    const options = {
      rpName: "AuthCompanion",
      rpID,
      userName,
      timeout: 60000,
      authenticatorSelection: {
        userVerification: "preferred",
        residentKey: "required",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    const generatedOptions = await generateRegistrationOptions(options);
    const now = new Date().toISOString();

    await this.db.insert(this.users).values({
      uuid: generatedOptions.user.id,
      name: userName,
      email: userEmail,
      password: hashedPassword,
      challenge: generatedOptions.challenge,
      active: 0,
      created_at: now,
      updated_at: now,
    });

    return generatedOptions;
  } catch (err) {
    console.error("Registration options error:", err);
    return reply.code(500).send({ error: "Internal server error" });
  }
};
