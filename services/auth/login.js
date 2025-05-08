import { verifyValueWithHash } from "../../utils/credential.js";
import { makeAccesstoken, makeRefreshtoken } from "../../utils/jwt.js";
import { refreshCookie } from "../../utils/cookies.js";
import config from "../../config.js";
import { eq } from "drizzle-orm";

export const loginHandler = async function (request, reply) {
  const {
    data: { type, attributes },
  } = request.body;

  // Validate request format
  if (type !== "users") {
    request.log.info("Auth API: Invalid type attribute during login");
    throw { statusCode: 400, message: "Invalid Type Attribute" };
  }

  // Find existing user
  const [existing] = await this.db
    .select({
      uuid: this.users.uuid,
      name: this.users.name,
      email: this.users.email,
      jwt_id: this.users.jwt_id,
      password: this.users.password,
      active: this.users.active,
      created_at: this.users.created_at,
    })
    .from(this.users)
    .where(eq(this.users.email, attributes.email));

  // Validate user account
  if (!existing?.active) {
    request.log.info("Auth API: Login attempt for invalid user");
    throw { statusCode: 400, message: "Login Failed" };
  }

  // Verify credentials
  const passwordValid = await verifyValueWithHash(attributes.password, existing.password);

  if (!passwordValid) {
    request.log.info("Auth API: Failed login attempt for ${existing.email}");
    throw { statusCode: 400, message: "Login Failed" };
  }

  // Generate tokens
  const accessToken = await makeAccesstoken(existing, this.key);
  const refreshToken = await makeRefreshtoken(existing, this.key, this);

  // Set response
  reply.headers({
    "set-cookie": [refreshCookie(refreshToken.token)],
    "x-authc-app-origin": config.APPLICATIONORIGIN,
  });

  return {
    data: {
      type: "users",
      id: existing.uuid,
      attributes: {
        name: existing.name,
        email: existing.email,
        created: existing.created_at,
        access_token: accessToken.token,
        access_token_expiry: accessToken.expiration,
      },
    },
  };
};
