// @ts-nocheck
import { createHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken, verifyRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { refreshCookie } from "../../utils/cookies.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const profileHandler = async function (request, reply) {
  const {
    data: { type, attributes },
  } = request.body;

  let sub;
  let isRecoveryFlow = false;

  if (request.query.token) {
    try {
      const payload = await verifyRefreshtoken(request.query.token, this.key);
      if (payload.recoveryToken !== "true") {
        throw new Error("Invalid recovery token");
      }
      sub = payload.sub;
      isRecoveryFlow = true;
    } catch (error) {
      request.log.error(`Recovery token validation failed: ${error.message}`);
      throw { statusCode: 401, message: "Invalid recovery token" };
    }
  } else {
    sub = request.jwtRequestPayload?.sub;
    if (!sub) throw { statusCode: 401, message: "Authentication required" };
  }

  const now = new Date().toISOString();

  if (type !== "users") {
    throw { statusCode: 400, message: "Invalid request type" };
  }

  try {
    const [currentUser] = await this.db
      .select({
        uuid: this.users.uuid,
        name: this.users.name,
        email: this.users.email,
        metadata: this.users.metadata,
        appdata: this.users.appdata,
        jwt_id: this.users.jwt_id,
      })
      .from(this.users)
      .where(eq(this.users.uuid, sub));

    if (!currentUser) {
      throw { statusCode: 404, message: "User not found" };
    }

    if (attributes.email && attributes.email !== currentUser.email) {
      const [existing] = await this.db
        .select({ email: this.users.email })
        .from(this.users)
        .where(eq(this.users.email, attributes.email));

      if (existing) {
        throw { statusCode: 409, message: "Email already in use" };
      }
    }

    const updateData = {
      name: attributes.name ?? currentUser.name,
      email: attributes.email ?? currentUser.email,
      updated_at: now,
    };

    if (attributes.password) {
      updateData.password = await createHash(attributes.password);
      // Invalidate all sessions by changing jwt_id
      updateData.jwt_id = randomUUID();
    }

    const [updatedUser] = await this.db.update(this.users).set(updateData).where(eq(this.users.uuid, sub)).returning({
      uuid: this.users.uuid,
      name: this.users.name,
      email: this.users.email,
      metadata: this.users.metadata,
      appdata: this.users.appdata,
      created_at: this.users.created_at,
      updated_at: this.users.updated_at,
      jwt_id: this.users.jwt_id,
    });

    let accessToken, refreshToken;
    if (!isRecoveryFlow) {
      accessToken = await makeAccesstoken(
        { ...updatedUser, metadata: updatedUser.metadata || "{}", appdata: updatedUser.appdata || "{}" },
        this.key
      );

      refreshToken = await makeRefreshtoken(
        { ...updatedUser, metadata: updatedUser.metadata || "{}", appdata: updatedUser.appdata || "{}" },
        this.key,
        this
      );
    }

    const headers = { "x-authc-app-origin": config.APPLICATIONORIGIN };
    if (!isRecoveryFlow && refreshToken) {
      headers["set-cookie"] = [refreshCookie(refreshToken.token)];
    }
    reply.headers(headers);

    return {
      data: {
        type: "users",
        id: updatedUser.uuid,
        attributes: {
          name: updatedUser.name,
          email: updatedUser.email,
          created: updatedUser.created_at,
          updated: updatedUser.updated_at,
          ...(!isRecoveryFlow && {
            access_token: accessToken?.token,
            access_token_expiry: accessToken?.expiration,
          }),
        },
      },
    };
  } catch (error) {
    request.log.error(`Profile update error: ${error.message}`);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Profile update failed",
    };
  }
};
