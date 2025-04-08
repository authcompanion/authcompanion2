import { createHash } from "../../utils/credential.js";
import { eq } from "drizzle-orm";

const validateStatus = (value, fieldName) => {
  if (value !== undefined && value !== 0 && value !== 1) {
    throw {
      statusCode: 400,
      message: `Invalid ${fieldName} status. Use 1 for true or 0 for false`,
    };
  }
};

export const updateUserHandler = async function (request, reply) {
  const { data } = request.body;
  const { uuid } = request.params;

  // Validate resource type
  if (data.type !== "users") {
    request.log.warn("Admin API: Invalid resource type for user update");
    throw { statusCode: 400, message: "Resource type must be 'users'" };
  }

  // Fetch existing user
  const [existingUser] = await this.db
    .select({
      name: this.users.name,
      email: this.users.email,
      metadata: this.users.metadata,
      appdata: this.users.appdata,
      isAdmin: this.users.isAdmin,
      active: this.users.active,
    })
    .from(this.users)
    .where(eq(this.users.uuid, uuid));

  if (!existingUser) {
    request.log.warn(`Admin API: Update attempt for non-existent user (${uuid})`);
    throw { statusCode: 404, message: "User not found" };
  }

  const { attributes } = data;

  // Validate email uniqueness if changing
  if (attributes.email && attributes.email !== existingUser.email) {
    const [existingEmail] = await this.db
      .select({ email: this.users.email })
      .from(this.users)
      .where(eq(this.users.email, attributes.email));

    if (existingEmail) {
      request.log.warn(`Admin API: Duplicate email attempt (${attributes.email})`);
      throw { statusCode: 409, message: "Email already in use" };
    }
  }

  // Validate status fields
  validateStatus(attributes.active, "active");
  validateStatus(attributes.isAdmin, "isAdmin");

  // Hash new password if provided
  let hashedPassword;
  if (attributes.password) {
    hashedPassword = await createHash(attributes.password);
  }

  // Prepare update data
  const updateData = {
    name: attributes.name ?? existingUser.name,
    email: attributes.email ?? existingUser.email,
    password: hashedPassword ?? existingUser.password,
    metadata: attributes.metadata ?? existingUser.metadata,
    appdata: attributes.appdata ?? existingUser.appdata,
    active: attributes.active ?? existingUser.active,
    isAdmin: attributes.isAdmin ?? existingUser.isAdmin,
    updated_at: new Date().toISOString(),
  };

  // Perform update
  const [updatedUser] = await this.db.update(this.users).set(updateData).where(eq(this.users.uuid, uuid)).returning({
    uuid: this.users.uuid,
    name: this.users.name,
    email: this.users.email,
    metadata: this.users.metadata,
    appdata: this.users.appdata,
    isAdmin: this.users.isAdmin,
    active: this.users.active,
    created_at: this.users.created_at,
    updated_at: this.users.updated_at,
  });

  reply.code(200);
  return {
    data: {
      type: "users",
      id: updatedUser.uuid,
      attributes: {
        name: updatedUser.name,
        email: updatedUser.email,
        metadata: updatedUser.metadata,
        app: updatedUser.appdata,
        active: updatedUser.active,
        isAdmin: updatedUser.isAdmin,
        created: updatedUser.created_at,
        updated: updatedUser.updated_at,
      },
    },
  };
};
