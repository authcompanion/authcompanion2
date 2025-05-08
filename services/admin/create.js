import { createHash } from "../../utils/credential.js";
import { randomUUID } from "crypto";
import { init } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

const validateStatus = (value, fieldName) => {
  if (value !== undefined && value !== 0 && value !== 1) {
    throw {
      statusCode: 400,
      message: `Invalid ${fieldName} status. Use 1 for true or 0 for false`,
    };
  }
};

const createId = init({ length: 10 });

export const createUserHandler = async function (request, reply) {
  const { data } = request.body;

  // Validate resource type
  if (data.type !== "users") {
    request.log.warn("Admin API: Invalid resource type attempted");
    throw { statusCode: 400, message: "Resource type must be 'users'" };
  }

  const { attributes } = data;
  const requiredFields = ["email", "password", "name"];

  // Check required fields
  for (const field of requiredFields) {
    if (!attributes[field]) {
      request.log.warn(`Admin API: Missing required field - ${field}`);
      throw { statusCode: 400, message: `Missing required field: ${field}` };
    }
  }

  // Check for existing user
  const [existingUser] = await this.db
    .select({ uuid: this.users.uuid })
    .from(this.users)
    .where(eq(this.users.email, attributes.email));

  if (existingUser) {
    request.log.warn(`Admin API: Duplicate email (${attributes.email}) attempt`);
    throw { statusCode: 409, message: "Email address already exists" };
  }

  // Validate status fields
  validateStatus(attributes.active, "active");
  validateStatus(attributes.isAdmin, "isAdmin");

  // Prepare user data
  const uuid = createId();
  const now = new Date().toISOString();
  const userData = {
    uuid,
    name: attributes.name,
    email: attributes.email,
    password: await createHash(attributes.password),
    active: attributes.active ?? 0,
    isAdmin: attributes.isAdmin ?? 0,
    metadata: attributes.metadata || {},
    appdata: attributes.appdata || {},
    jwt_id: randomUUID(),
    created_at: now,
    updated_at: now,
  };

  // Create user record
  const [createdUser] = await this.db.insert(this.users).values(userData).returning({
    uuid: this.users.uuid,
    name: this.users.name,
    email: this.users.email,
    metadata: this.users.metadata,
    appdata: this.users.appdata,
    active: this.users.active,
    isAdmin: this.users.isAdmin,
    created: this.users.created_at,
    updated: this.users.updated_at,
  });

  reply.code(201);

  return {
    data: {
      type: "users",
      id: createdUser.uuid,
      attributes: createdUser,
    },
  };
};
