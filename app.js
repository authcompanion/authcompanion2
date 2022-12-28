import Fastify from "fastify";
import serverRoutes from "./routes/api.routes.js";
import webRoutes from "./routes/ui.routes.js";
import sqlite3 from "./db/db.js";
import serverkey from "./utilities/key.js";
import config from "./config.js";

export default async function buildApp(opts = {}) {
  const app = Fastify(opts);

  //register the sqlite database plugin
  app.register(sqlite3, opts);
  //register the server key plugin
  app.register(serverkey);

  //register the authentication api routes. set the prefix for all api routes globally
  app.register(serverRoutes, { prefix: "/v1/auth" });
  //register the frontend routes used for the UI if true in .env
  if (config.WEBMODE == "true") {
    app.register(webRoutes, { prefix: "/v1/web" });
  }

  //register a default route welcoming the user
  app.register(async function defaultRoute(fastify, opts) {
    fastify.get("/", async (req, reply) => {
      return `Welcome and hello 👋. AuthCompanion is serving requests!
      Please navigate to the login and registration web forms`;
    });
  });
  return app;
}
