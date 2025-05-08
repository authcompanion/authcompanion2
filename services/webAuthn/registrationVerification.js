import config from "../../config.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";

export const registrationVerificationHandler = async function (request, reply) {
  try {
    const userId = request.headers["x-authc-app-userid"];
    if (!userId) return reply.code(401).send({ error: "Missing user ID" });

    // Get RP configuration
    const appURL = new URL(config.ORIGIN);
    const expectedRPID = appURL.hostname;
    const expectedOrigin = appURL.origin;

    // Get user challenge
    const [user] = await this.db
      .select({ challenge: this.users.challenge })
      .from(this.users)
      .where(eq(this.users.uuid, userId));

    if (!user?.challenge) return reply.code(404).send({ error: "User not found" });

    // Verify registration response
    const verification = await verifyRegistrationResponse({
      response: request.body,
      expectedChallenge: user.challenge,
      expectedOrigin,
      expectedRPID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return reply.code(400).send({ error: "Registration verification failed" });
    }

    // Store authenticator
    const { publicKey, id, counter } = verification.registrationInfo.credential;
    const [authenticator] = await this.db
      .insert(this.authenticator)
      .values({
        credentialID: Buffer.from(id).toString("hex"),
        credentialPublicKey: Buffer.from(publicKey).toString("hex"),
        counter,
        transports: request.body.response.transports?.join(",") || "",
      })
      .returning({ id: this.authenticator.id });

    // Activate user and link authenticator
    const [updatedUser] = await this.db
      .update(this.users)
      .set({ authenticatorId: authenticator.id, active: 1 })
      .where(eq(this.users.uuid, userId))
      .returning({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        created_at: this.users.created_at,
      });

    // Generate tokens
    const accessToken = await makeAccesstoken(updatedUser, this.key);
    const refreshToken = await makeRefreshtoken(updatedUser, this.key, this);

    // Configure response
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    reply.headers({
      "set-cookie": [
        `userRefreshToken=${refreshToken.token}; Path=/; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
      ],
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: updatedUser.uuid,
        type: "users",
        attributes: {
          name: updatedUser.name,
          email: updatedUser.email,
          created: updatedUser.created_at,
          access_token: accessToken.token,
          access_token_expiry: accessToken.expiration,
        },
      },
    };
  } catch (err) {
    console.error("Verification error:", err);
    return reply.code(500).send({ error: "Internal server error" });
  }
};
