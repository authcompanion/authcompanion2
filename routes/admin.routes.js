import { createUserHandler } from "../services/admin/user/create.js";
import { createSchema } from "../services/admin/user/schema/createSchema.js";

import { authenticateRequest } from "../utilities/authenticate.js";

const adminRoutes = async function (fastify, options) {
  //admin API routes
  fastify.post("/users", createSchema, createUserHandler);
};

export default adminRoutes;
