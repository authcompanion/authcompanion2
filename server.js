import { buildApp } from "./app.js";
import config from "./config.js";

const startServer = async () => {
  try {
    const server = await buildApp({
      logger: true,
      forceCloseConnections: true,
    });

    await server.listen({
      port: config.AUTHPORT,
      host: "0.0.0.0",
    });
    const addresses = server.addresses();

    printStartupMessage(addresses[0].address, addresses[0].port);
    setupGracefulShutdown(server);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

function printStartupMessage(address, port) {
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
      server.log.info(`AuthCompanion has exited. Goodbye! 👋`);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  process.on("SIGTERM", handleSignal);
  process.on("SIGINT", handleSignal);
  process.on("SIGUSR2", handleSignal);
}

startServer();
