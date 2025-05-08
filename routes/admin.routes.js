import { readFileSync } from "fs";
import { createUserHandler } from "../services/admin/create.js";
import { createSchema } from "../services/admin/schema/createSchema.js";
import { listUsersHandler } from "../services/admin/list.js";
import { listUsersSchema } from "../services/admin/schema/listSchema.js";
import { deleteUserHandler } from "../services/admin/delete.js";
import { deleteSchema } from "../services/admin/schema/deleteSchema.js";
import { updateUserHandler } from "../services/admin/update.js";
import { updateSchema } from "../services/admin/schema/updateSchema.js";
import { loginHandler } from "../services/admin/login.js";
import { loginSchema } from "../services/admin/schema/loginSchema.js";
import { tokenRefreshHandler, tokenRefreshDeleteHandler } from "../services/admin/refresh.js";
import { refreshSchema } from "../services/admin/schema/refreshSchema.js";
import { logoutHandler } from "../services/admin/logout.js";
import { logoutSchema } from "../services/admin/schema/logoutSchema.js";
import { authenticateAdminRequest } from "../utils/authenticate.js";

const adminRoutes = async function (fastify, options) {
  //Admin API routes
  fastify.post("/users", { onRequest: [authenticateAdminRequest], ...createSchema }, createUserHandler);
  fastify.get("/users", { onRequest: [authenticateAdminRequest], ...listUsersSchema }, listUsersHandler);
  fastify.delete("/users/:uuid", { onRequest: [authenticateAdminRequest], ...deleteSchema }, deleteUserHandler);
  fastify.patch("/users/:uuid", { onRequest: [authenticateAdminRequest], ...updateSchema }, updateUserHandler);
  fastify.post("/login", loginSchema, loginHandler);
  fastify.post("/token/refresh", refreshSchema, tokenRefreshHandler);
  fastify.delete("/token/refresh", refreshSchema, tokenRefreshDeleteHandler);
  fastify.delete("/logout/:uuid", { onRequest: [authenticateAdminRequest], ...logoutSchema }, logoutHandler);
};

export default adminRoutes;
