import { createUserHandler } from "../services/admin/users/create.js";
import { createSchema } from "../services/admin/users/schema/createSchema.js";

import { listUsersHandler } from "../services/admin/users/list.js";

import { authenticateRequest } from "../utilities/authenticate.js";

const adminRoutes = async function (fastify, options) {
  //admin API routes
  fastify.post("/users", createSchema, createUserHandler);
  fastify.get("/users", listUsersHandler);
};

export default adminRoutes;
