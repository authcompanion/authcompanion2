import buildApp from "./app.js";
import config from "./config.js";

async function startServer() {
  try {
    const server = await buildApp({
      logger: true,
      forceCloseConnections: true,
    });

    await server.listen({
      port: config.AUTHPORT,
      host: "0.0.0.0",
    });

    printStartupMessage(config.AUTHPORT);
    setupGracefulShutdown(server);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

function printStartupMessage(port) {
  console.log(`
      ###########################################################
                The AuthCompanion Server has started

           🖥️   Client UI on: http://localhost:${port}/v1/web/login
           🚀   Admin UI on: http://localhost:${port}/v1/admin/login

      ###########################################################
      `);
  console.log("Use CTRL-C to shut down AuthCompanion");
}

function setupGracefulShutdown(server) {
  const handleSignal = async () => {
    try {
      await server.close();
      console.log("AuthCompanion has exited. Goodbye! 👋");
      process.exit(0);
    } catch (error) {
      console.error("Error shutting down server:", error);
      process.exit(1);
    }
  };

  process.on("SIGTERM", handleSignal);
  process.on("SIGINT", handleSignal);
  process.on("SIGUSR2", handleSignal);
}

startServer();
