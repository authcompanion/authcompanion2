import { createHash, secureCookie } from "../../utils/credential.js";
import { randomUUID } from "crypto";
import { createId } from "@paralleldrive/cuid2";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { refreshCookie } from "../../utils/cookies.js";
import { eq } from "drizzle-orm";

export const registrationHandler = async function (request, reply) {
  const {
    data: { type, attributes },
  } = request.body;

  // Validate request
  if (type !== "users") {
    request.log.info("Auth API: Invalid type attribute during registration");
    throw { statusCode: 400, message: "Invalid Type Attribute" };
  }

  // Check for existing user
  const [existing] = await this.db
    .select({ uuid: this.users.uuid })
    .from(this.users)
    .where(eq(this.users.email, attributes.email));

  if (existing) {
    request.log.info("Auth API: Duplicate registration attempt");
    throw { statusCode: 400, message: "Registration Failed" };
  }

  // Create new user
  const user = {
    uuid: createId(),
    name: attributes.name,
    email: attributes.email,
    password: await createHash(attributes.password),
    active: true,
    metadata: attributes.metadata,
    jwt_id: randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const [created] = await this.db.insert(this.users).values(user).returning({
    uuid: this.users.uuid,
    name: this.users.name,
    email: this.users.email,
    created_at: this.users.created_at,
  });

  // Generate tokens
  const accessToken = await makeAccesstoken(created, this.key);
  const refreshToken = await makeRefreshtoken(created, this.key, this);

  // Set response
  reply.code(201).headers({
    "set-cookie": [refreshCookie(refreshToken.token)],
    "x-authc-app-origin": config.REGISTRATIONORIGIN,
  });

  return {
    data: {
      type: "users",
      id: created.uuid,
      attributes: {
        name: created.name,
        email: created.email,
        created: created.created_at,
        access_token: accessToken.token,
        access_token_expiry: accessToken.expiration,
      },
    },
  };
};
