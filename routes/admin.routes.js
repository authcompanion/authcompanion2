import { readFileSync } from "fs";

import { createUserHandler } from "../services/admin/users/create.js";
import { createSchema } from "../services/admin/users/schema/createSchema.js";

import { listUsersHandler } from "../services/admin/users/list.js";
import { listUsersSchema } from "../services/admin/users/schema/listSchema.js";

import { deleteUserHandler } from "../services/admin/users/delete.js";

import { updateUserHandler } from "../services/admin/users/update.js";
import { updateSchema } from "../services/admin/users/schema/updateSchema.js";

import { loginHandler } from "../services/admin/users/login.js";
import { loginSchema } from "../services/admin/users/schema/loginSchema.js";

import { logoutHandler } from "../services/admin/users/logout.js";

import { tokenRefreshHandler } from "../services/admin/users/refresh.js";
import { refreshSchema } from "../services/admin/users/schema/refreshSchema.js";

import {
  authenticateAdminRequest,
  authenticateWebAdminRequest,
} from "../utils/authenticate.js";

const adminRoutes = async function (fastify, options) {
  //admin API routes
  fastify.post(
    "/users",
    { onRequest: [authenticateAdminRequest], ...createSchema },
    createUserHandler
  );
  fastify.get(
    "/users",
    { onRequest: [authenticateAdminRequest], ...listUsersSchema },
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
  fastify.get(
    "/logout",
    { onRequest: [authenticateAdminRequest] },
    logoutHandler
  );
  fastify.post("/refresh", refreshSchema, tokenRefreshHandler);

  //admin web user interface routes
  fastify.get(
    "/dashboard",
    { onRequest: [authenticateWebAdminRequest] },
    (request, reply) => {
      const adminPage = readFileSync("./client/admin/dashboardPage.html");
      reply.headers({
        "Content-Type": `text/html`,
      });
      return adminPage;
    }
  );

  //login page for the admin web user interface
  fastify.get("/login", (request, reply) => {
    const loginPage = readFileSync("./client/admin/loginAdminPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return loginPage;
  });
};

export default adminRoutes;
