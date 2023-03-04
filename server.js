import buildApp from "./app.js";
import config from "./config.js";

const server = await buildApp({
  logger: true,
  forceCloseConnections: true,
});

/**
 * Let's run the AuthCompanion server!
 */
function startServer() {
  server.listen(
    {
      port: config.AUTHPORT,
      host: "0.0.0.0",
    },
    (err) => {
      if (err) {
        console.log("Error starting server:", err);
        process.exit(1);
      }
    }
  );
  console.log(`
      ###########################################################
                The AuthCompanion Server has started

           🖥️   Client UI on: http://localhost:${config.AUTHPORT}/v1/web/login
           🚀   Admin UI on: http://localhost:${config.AUTHPORT}/v1/admin/login


      ###########################################################
      `);
  console.log("Use CTRL-C to shutdown AuthCompanion");
}

//setup for gracefully exiting the AuthCompanion server
async function handleSignal() {
  try {
    await server.close();
    console.log(`
  AuthCompanion has exited, Good bye👋`);
    process.exit(0);
  } catch (error) {
    console.log("Error shutting down server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", handleSignal);
process.on("SIGINT", handleSignal);
process.on("SIGUSR2", handleSignal);

startServer();
