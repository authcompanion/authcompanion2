import Fastify from "fastify";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webRoutes from "./routes/ui.routes.js";
import sqlite3 from "./db/sqlite/db.js";
import serverkey from "./key/server.key.js";
import adminkey from "./key/admin.key.js";
import pkg from "./package.json" assert { type: "json" };

const appVersion = pkg.version;

export const buildApp = async (serverOptions) => {
  const app = Fastify(serverOptions);
  try {
    //Register the default authc plugins and routes
    await app
      .register(sqlite3)
      .register(serverkey)
      .register(adminkey)
      .register(adminRoutes, { prefix: "/v1/admin" })
      .register(authRoutes, { prefix: "/v1/auth" })
      .register(webRoutes, { prefix: "/v1/web" })
      .register(async (fastify, opts) => {
        fastify.get("/", async (req, reply) => {
          return `Welcome and hello 👋 - AuthCompanion is serving requests!
          Version: ${appVersion}`;
        });
      });
    await app.ready();
    return app;
  } catch (err) {
    throw err; // Rethrow the error to indicate app initialization failure
  }
};
