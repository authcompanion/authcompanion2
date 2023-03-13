import { readFileSync } from "fs";

import { createUserHandler } from "../services/admin/users/create.js";
import { createSchema } from "../services/admin/users/schema/createSchema.js";

import { listUsersHandler } from "../services/admin/users/list.js";

import { deleteUserHandler } from "../services/admin/users/delete.js";

import { updateUserHandler } from "../services/admin/users/update.js";
import { updateSchema } from "../services/admin/users/schema/updateSchema.js";

import { loginHandler } from "../services/admin/users/login.js";
import { loginSchema } from "../services/admin/users/schema/loginSchema.js";

import {
  authenticateAdminRequest,
  authenticateWebAdminRequest,
} from "../utilities/authenticate.js";

const adminRoutes = async function (fastify, options) {
  //admin API routes
  fastify.post(
    "/users",
    { onRequest: [authenticateAdminRequest], ...createSchema },
    createUserHandler
  );
  fastify.get(
    "/users",
    { onRequest: [authenticateAdminRequest] },
    listUsersHandler
  );
  fastify.delete(
    "/users/:uuid",
    { onRequest: [authenticateAdminRequest] },
    deleteUserHandler
  );
  fastify.patch(
    "/users/:uuid",
    { onRequest: [authenticateAdminRequest], ...updateSchema },
    updateUserHandler
  );
  fastify.post("/login", loginSchema, loginHandler);

  //admin web user interface routes
  fastify.get(
    "/dashboard",
    { onRequest: [authenticateWebAdminRequest] },
    (request, reply) => {
      const adminPage = readFileSync("./ui/admin/dashboardPage.html");
      reply.headers({
        "Content-Type": `text/html`,
      });
      return adminPage;
    }
  );

  //login page for the admin web user interface
  fastify.get("/login", (request, reply) => {
    const loginPage = readFileSync("./ui/admin/loginAdminPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return loginPage;
  });
};

export default adminRoutes;
