import Fastify from "fastify";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webRoutes from "./routes/ui.routes.js";
import sqlite3 from "./plugins/db/db.js";
import serverkey from "./plugins/key/server.key.js";
import adminkey from "./plugins/key/admin.key.js";

import pkg from "./package.json" assert { type: "json" };
const appVersion = pkg.version;

const buildApp = async function (serverOptions) {
  const app = await Fastify(serverOptions);

  //register the sqlite database plugin
  await app.register(sqlite3);
  //register the server key plugin
  await app.register(serverkey);
  //register the admin key plugin
  await app.register(adminkey);

  //register the admin api routes
  await app.register(adminRoutes, { prefix: "/v1/admin" });
  //register the authentication api routes
  await app.register(authRoutes, { prefix: "/v1/auth" });
  //register the frontend routes used for the UI. This is optional
  await app.register(webRoutes, { prefix: "/v1/web" });

  //register a default route welcoming the user
  await app.register(async function defaultRoute(fastify, opts) {
    fastify.get("/", async (req, reply) => {
      return `Welcome and hello 👋 - AuthCompanion is serving requests!      
      Version: ${appVersion}
      `;
    });
  });

  return app;
};

export default buildApp;
