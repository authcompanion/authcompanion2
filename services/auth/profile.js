import { createHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { refreshCookie } from "../../utils/cookies.js";
import { eq } from "drizzle-orm";

export const profileHandler = async function (request, reply) {
  const {
    data: { type, attributes },
  } = request.body;
  const sub = request.jwtRequestPayload.sub;
  const now = new Date().toISOString();

  // Validate request format
  if (type !== "users") {
    request.log.info("Auth API: Invalid type attribute during profile update");
    throw { statusCode: 400, message: "Invalid Type Attribute" };
  }

  // Get current user data with all necessary fields
  const [currentUser] = await this.db
    .select({
      uuid: this.users.uuid,
      name: this.users.name,
      email: this.users.email,
      metadata: this.users.metadata,
      appdata: this.users.appdata,
    })
    .from(this.users)
    .where(eq(this.users.uuid, sub));

  if (!currentUser) {
    request.log.info("Auth API: User not found during profile update");
    throw { statusCode: 404, message: "User Not Found" };
  }

  // Validate email uniqueness if changing
  if (attributes.email && attributes.email !== currentUser.email) {
    const [existing] = await this.db
      .select({ email: this.users.email })
      .from(this.users)
      .where(eq(this.users.email, attributes.email));

    if (existing) {
      request.log.info("Auth API: Duplicate email attempt during profile update");
      throw { statusCode: 409, message: "Email Already In Use" };
    }
  }

  // Prepare update data
  const updateData = {
    name: attributes.name ?? currentUser.name,
    email: attributes.email ?? currentUser.email,
    updated_at: now,
  };

  // Handle password update
  if (attributes.password) {
    updateData.password = await createHash(attributes.password);
  }

  // Perform update and return all necessary fields
  const [updatedUser] = await this.db.update(this.users).set(updateData).where(eq(this.users.uuid, sub)).returning({
    uuid: this.users.uuid,
    name: this.users.name,
    email: this.users.email,
    metadata: this.users.metadata,
    appdata: this.users.appdata,
    created_at: this.users.created_at,
    updated_at: this.users.updated_at,
  });

  // Generate new tokens with updated claims
  const accessToken = await makeAccesstoken(
    {
      ...updatedUser,
      metadata: updatedUser.metadata || "{}",
      appdata: updatedUser.appdata || "{}",
    },
    this.key
  );

  const refreshToken = await makeRefreshtoken(
    {
      ...updatedUser,
      metadata: updatedUser.metadata || "{}",
      appdata: updatedUser.appdata || "{}",
    },
    this.key,
    this
  );

  // Set response headers
  reply.headers({
    "set-cookie": [refreshCookie(refreshToken.token)],
    "x-authc-app-origin": config.APPLICATIONORIGIN,
  });

  return {
    data: {
      type: "users",
      id: updatedUser.uuid,
      attributes: {
        name: updatedUser.name,
        email: updatedUser.email,
        created: updatedUser.created_at,
        updated: updatedUser.updated_at,
        access_token: accessToken.token,
        access_token_expiry: accessToken.expiration,
      },
    },
  };
};
