/* Application Modules */
import { buildApp } from "./app.js";
import config from "./config.js";

/* Constants */
const SERVER_SHUTDOWN_SIGNALS = ["SIGTERM", "SIGINT", "SIGUSR2"];
const SERVER_CONFIG = {
  logger: {
    level: "info",
  },
  forceCloseConnections: true,
  listenOptions: {
    port: config.AUTHPORT,
    host: "0.0.0.0",
  },
};

/**
 * Main entry point for starting the AuthCompanion server
 */
async function startServer() {
  try {
    const server = await initializeServer();
    registerShutdownHooks(server);
    logStartupDetails(server);
  } catch (error) {
    handleStartupError(error);
  }
}

/**
 * Initializes and starts the Fastify server
 */
async function initializeServer() {
  const server = await buildApp({
    ...SERVER_CONFIG,
  });

  await server.listen(SERVER_CONFIG.listenOptions);
  return server;
}

/**
 * Handles server shutdown gracefully
 */
function registerShutdownHooks(server) {
  const shutdownHandler = async (signal) => {
    try {
      console.log(`\nReceived ${signal} - Shutting down gracefully`);
      await server.close();
      console.log("AuthCompanion has exited. Goodbye! 👋");
      process.exit(0);
    } catch (error) {
      handleShutdownError(error);
    }
  };

  SERVER_SHUTDOWN_SIGNALS.forEach((signal) => {
    process.on(signal, () => shutdownHandler(signal));
  });
}

/**
 * Displays formatted startup message with server details
 */
function logStartupDetails(server) {
  const { address, port } = server.addresses()[0];
  const baseUrl = `http://localhost:${port}`;

  console.log(`
    ###########################################################
              🔒 AuthCompanion Server Operational 🔒

         🌐 Version:      ${config.VERSION}
         📡 Environment:  ${process.env.NODE_ENV || "development"}
         🚨 Port:         ${port}

         🔧 Endpoints:
             🖥️  Client UI:  ${baseUrl}/
             🛠️  Admin UI:   ${baseUrl}/admin/login
             📒  API Documentation:   ${baseUrl}/docs/api


    ###########################################################
  `);
  console.log("Use CTRL-C to initiate graceful shutdown\n");
}

/**
 * Handles critical startup failures
 */
function handleStartupError(error) {
  console.error("💥 Critical Server Startup Failure:");
  console.error(error);
  process.exit(1);
}

/**
 * Handles shutdown sequence errors
 */
function handleShutdownError(error) {
  console.error("❌ Graceful shutdown failed:");
  console.error(error);
  process.exit(1);
}

// Start the application
startServer();
