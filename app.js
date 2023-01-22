import Fastify from "fastify";
import serverRoutes from "./routes/api.routes.js";
import webRoutes from "./routes/ui.routes.js";
import sqlite3 from "./plugins/db/db.js";
import serverkey from "./plugins/key/key.js";
import config from "./config.js";

const buildApp = async function (opts) {
  const app = await Fastify(opts);

  //register the sqlite database plugin
  app.register(sqlite3, opts);
  //register the server key plugin
  app.register(serverkey);

  //register the authentication api routes. set the prefix for all api routes globally
  await app.register(serverRoutes, { prefix: "/v1/auth" });
  //register the frontend routes used for the UI if true in .env
  if (config.WEBMODE == "true") {
    await app.register(webRoutes, { prefix: "/v1/web" });
  }

  //register a default route welcoming the user
  await app.register(async function defaultRoute(fastify, opts) {
    fastify.get("/", async (req, reply) => {
      return `Welcome and hello 👋. AuthCompanion is serving requests!
      Please navigate to the login and registration web forms`;
    });
  });
  return app;
};

export default buildApp;
