import config from "../../config.js";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { eq } from "drizzle-orm";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";

export const loginVerificationHandler = async function (request, reply) {
  try {
    const { hostname: rpID, origin } = new URL(config.ORIGIN);
    const { sessionID, attResp } = request.body;

    if (!sessionID) throw { statusCode: 400, message: "Missing session ID" };

    // Get stored challenge
    const [session] = await this.db
      .select({ data: this.storage.data })
      .from(this.storage)
      .where(eq(this.storage.sessionID, sessionID));

    if (!session) throw { statusCode: 400, message: "Invalid session" };

    // Get user handle from response
    const userID = attResp.response.userHandle;
    if (!userID) throw { statusCode: 400, message: "Missing user handle" };

    // Get user with ALL required fields + authenticatorId in one query
    const [user] = await this.db
      .select({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        jwt_id: this.users.jwt_id,
        created_at: this.users.created_at,
        authenticatorId: this.users.authenticatorId, // Critical for authenticator lookup
      })
      .from(this.users)
      .where(eq(this.users.uuid, userID));

    if (!user) throw { statusCode: 404, message: "User not found" };
    if (!user.authenticatorId) throw { statusCode: 400, message: "User has no authenticator linked" };

    // Get authenticator using the user's authenticatorId
    const [authenticator] = await this.db
      .select({
        credentialPublicKey: this.authenticator.credentialPublicKey,
        credentialID: this.authenticator.credentialID,
        counter: this.authenticator.counter,
        transports: this.authenticator.transports,
      })
      .from(this.authenticator)
      .where(eq(this.authenticator.id, user.authenticatorId));

    if (!authenticator) throw { statusCode: 404, message: "Authenticator not found" };

    // Verify authentication
    const verification = await verifyAuthenticationResponse({
      response: attResp,
      expectedChallenge: session.data,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        publicKey: Buffer.from(authenticator.credentialPublicKey, "hex"),
        id: Buffer.from(authenticator.credentialID, "hex"),
        counter: authenticator.counter,
        transports: authenticator.transports,
      },
      requireUserVerification: false,
    });

    if (!verification.verified) throw { statusCode: 401, message: "Verification failed" };

    // Cleanup session
    await this.db.delete(this.storage).where(eq(this.storage.sessionID, sessionID));

    // Generate tokens using the user data we already have
    const accessToken = await makeAccesstoken(user, this.key);
    const refreshToken = await makeRefreshtoken(user, this.key, this);

    // Set response
    reply.headers({
      "set-cookie": [
        `userRefreshToken=${refreshToken.token}; Path=/; Expires=${new Date(Date.now() + 604800000).toUTCString()}; SameSite=None; Secure; HttpOnly`,
      ],
      "x-authc-app-origin": config.APPLICATIONORIGIN,
    });

    return {
      data: {
        id: user.uuid,
        type: "Login",
        attributes: {
          ...user,
          access_token: accessToken.token,
          access_token_expiry: accessToken.expiration,
        },
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode || 500, message: err.message };
  }
};
