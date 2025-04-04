import Fastify from "fastify";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webRoutes from "./routes/ui.routes.js";
import database from "./db/db.js";
import serverKey from "./key/server.key.js";
import adminKey from "./key/admin.key.js";

// Constants for API versioning and route prefixes
const API_VERSION = "v1";
const ROUTE_PREFIXES = {
  ADMIN: `/${API_VERSION}/admin`,
  AUTH: `/${API_VERSION}/auth`,
  WEB: `/${API_VERSION}/web`,
};

export const buildApp = async (serverOptions = {}) => {
  const app = Fastify(serverOptions);

  // Register core plugins first
  await app.register(database).register(serverKey).register(adminKey);

  // Register routes with proper error handling
  const plugins = [
    { plugin: adminRoutes, options: { prefix: ROUTE_PREFIXES.ADMIN } },
    { plugin: authRoutes, options: { prefix: ROUTE_PREFIXES.AUTH } },
    { plugin: webRoutes, options: { prefix: ROUTE_PREFIXES.WEB } },
  ];

  for (const { plugin, options } of plugins) {
    await app.register(plugin, options);
  }

  // Add health check endpoints
  app.register(async (fastify) => {
    fastify.get("/", async () => {
      return "Welcome and hello 👋 - AuthCompanion is serving requests!";
    });

    fastify.get("/health", async () => ({ status: "OK" }));
    fastify.get("/ready", async () => ({ status: "READY" }));
  });

  // Add global error handler
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: {
        message: error.message,
        code: error.code,
      },
    });
  });

  // Add graceful shutdown
  app.addHook("onClose", async (instance) => {
    await instance.database?.disconnect?.();
  });

  try {
    await app.ready();
    return app;
  } catch (error) {
    app.log.error(error);
    await app.close();
    throw new Error("Failed to initialize application");
  }
};
