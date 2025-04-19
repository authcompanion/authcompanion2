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
        title: "Server API Documentation",
        description: `Comprehensive API documentation for AuthCompanion's secure authentication Server.
          Features
          - User authentication & session management
          - Admin-level user administration
          - Passwordless WebAuthn integration
          
          Try endpoints directly from this documentation for interactive testing.`,
        version: "5.0.0",
        contact: {
          name: "AuthCompanion Support",
          email: "support@authcompanion.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3002",
          description: "Local development server",
        },
      ],
      tags: [
        {
          name: "Auth API",
          description:
            "Authentication flows including login, registration, and token management; that powers the public web forms.",
        },
        {
          name: "Admin API",
          description: "Privileged user management operations requiring admin permissions",
          externalDocs: {
            description: "Admin Guide",
            url: "https://docs.authcompanion.com/admin-guide",
          },
        },
        {
          name: "WebAuthn API",
          description: "FIDO2 WebAuthn integration for passwordless authentication flows",
        },
        {
          name: "Health Checks",
          description: "Real-time server status monitoring and service health verification",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Admin JWT token obtained through authentication",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
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
          description: "For health checking.",
          tags: ["Health Checks"],
          summary: "Check the health of the AuthC Server",
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
