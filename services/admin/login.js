import { verifyValueWithHash, secureCookie } from "../../utils/credential.js";
import { makeAdminToken, makeAdminRefreshtoken } from "../../utils/jwt.js";
import config from "../../config.js";
import { eq } from "drizzle-orm";

export const loginHandler = async function (request, reply) {
  const { data } = request.body;

  // Validate resource type
  if (data.type !== "users") {
    request.log.warn("Admin login: Invalid resource type attempted");
    throw { statusCode: 400, message: "Resource type must be 'users'" };
  }

  const { attributes } = data;
  const requiredFields = ["email", "password"];

  // Validate required fields
  for (const field of requiredFields) {
    if (!attributes[field]) {
      request.log.warn(`Admin login: Missing required field - ${field}`);
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }

  // Fetch user from database
  const [user] = await this.db
    .select({
      name: this.users.name,
      email: this.users.email,
      uuid: this.users.uuid,
      password: this.users.password,
      active: this.users.active,
      isAdmin: this.users.isAdmin,
      created_at: this.users.created_at,
    })
    .from(this.users)
    .where(eq(this.users.email, attributes.email));

  // Validate user existence and status
  if (!user) {
    request.log.warn(`Admin login: Attempt with non-existent email (${attributes.email})`);
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  if (!user.active) {
    request.log.warn(`Admin login: Attempt to access inactive account (${user.email})`);
    throw { statusCode: 403, message: "Account inactive" };
  }

  if (user.isAdmin !== true) {
    request.log.warn(`Admin login: Non-admin access attempt (${user.email})`);
    throw { statusCode: 403, message: "Access denied" };
  }

  // Verify password
  const passwordValid = await verifyValueWithHash(attributes.password, user.password);

  if (!passwordValid) {
    request.log.warn(`Admin login: Failed password attempt for (${user.email})`);
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  // Generate tokens
  const accessToken = await makeAdminToken(user, this.key);
  const refreshToken = await makeAdminRefreshtoken(user, this.key, this);

  // Configure cookie expiration
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + config.ADMIN_SESSION_DAYS);

  // Construct cookie header
  const cookieValue = [
    `adminRefreshToken=${refreshToken.token}`,
    "Path=/",
    `Expires=${expireDate.toUTCString()}`,
    `SameSite=${config.SAMESITE}`,
    "HttpOnly",
    secureCookie(),
  ].join("; ");

  // Set response headers
  reply.headers({
    "set-cookie": [cookieValue],
    "x-authc-app-origin": config.ADMIN_ORIGIN,
  });

  return {
    data: {
      type: "users",
      id: user.uuid,
      attributes: {
        name: user.name,
        email: user.email,
        access_token: accessToken.token,
        access_token_expiry: accessToken.expiration,
        created: user.created_at,
      },
    },
  };
};
