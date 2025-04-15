import Fastify from "fastify";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import database from "./db/db.js";
import serverKey from "./key/server.key.js";
import adminKey from "./key/admin.key.js";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { readFileSync } from "fs";
import path from "path";

// Constants for API versioning and route prefixes
const API_VERSION = "v1";
const ROUTE_PREFIXES = {
  ADMIN: `/${API_VERSION}/admin`,
  AUTH: `/${API_VERSION}/auth`,
};

export const buildApp = async (serverOptions = {}) => {
  const app = Fastify(serverOptions);

  // Cache the SPA page at server start (not on every request)
  const spaPath = path.join(process.cwd(), "client", "dist", "index.html");
  let spaPage;

  try {
    spaPage = readFileSync(spaPath, "utf8");
  } catch (error) {
    throw new Error(`Failed to cache SPA page: ${error.message}`);
  }

  // Register core plugins first
  await app.register(database).register(serverKey).register(adminKey);

  // Register static assets plugin
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), "client", "dist"),
    prefix: "/", // Serve from root path
    decorateReply: false, // Disable automatic headers
  });

  // Register OpenAPI Documentation
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "AuthCompanion Server API Documentation",
        description:
          "Documentation for the User Management Server - for seamless and secure integration of user authentication. Try out the endpoints directly from the documenation to get to know ther Server.",
        version: "5.0.0",
      },
      servers: [
        {
          url: "http://localhost:3002",
        },
      ],
      tags: [
        { name: "Auth API", description: "Code related end-points" },
        { name: "Admin API", description: "User related end-points" },
        { name: "WebAuthn API", description: "AuthCompanion's Web Forms" },
        { name: "Health Checks", description: "AuthCompanion's Web Forms" },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
    },
  });
  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs/api",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  // Register routes with proper error handling
  const plugins = [
    { plugin: adminRoutes, options: { prefix: ROUTE_PREFIXES.ADMIN } },
    { plugin: authRoutes, options: { prefix: ROUTE_PREFIXES.AUTH } },
  ];

  for (const { plugin, options } of plugins) {
    await app.register(plugin, options);
  }

  // Add health check endpoints
  app.register(async (fastify) => {
    fastify.get(
      "/health",
      {
        schema: {
          description: "post some data",
          tags: ["Health Checks"],
          summary: "qwerty",
        },
      },
      async () => ({ status: "OK" })
    );
  });

  // Add SPA catch-all route
  app.setNotFoundHandler((request, reply) => {
    reply.code(200).header("Content-Type", "text/html; charset=utf-8").send(spaPage);
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
