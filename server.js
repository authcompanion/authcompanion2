import buildApp from "./app.js";
import config from "./config.js";

const server = await buildApp({
  logger: true,
});

/**
 * Let's run the AuthCompanion server!
 */
const startServer = async () => {
  try {
    await server.listen({
      port: config.AUTHPORT,
      host: "0.0.0.0",
    });
    console.log(`
      #############################################################
              The Authcompanion Server has started
      🖥️   UI example on: http://localhost:${config.AUTHPORT}/v1/web/login
      🚀  API example on: http://localhost:${config.AUTHPORT}/v1/auth/register
      #############################################################
      `);
    console.log("Use CTRL-C to shutdown AuthCompanion");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

//setup for gracefully exiting the AuthCompanion server
async function handleSignal() {
  try {
    await server.close();
  console.log(`
    AuthCompanion has exited, Good bye👋`)
  } catch (error) {
    server.log.error(err);
    process.exit(1);
  }
}

process.on("SIGTERM", handleSignal);
process.on("SIGINT", handleSignal);

await startServer();
