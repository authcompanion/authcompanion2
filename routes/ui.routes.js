import { readFileSync } from "fs";
import { randomUUID } from "crypto";

const webRoutes = async function (fastify, options) {
  fastify.get("/login", (request, reply) => {
    //create session id for tracking webauthn challenges used for verification. Send session id as cookie
    const sessionID = randomUUID();
    const loginPage = readFileSync("./client/auth/loginPage.html");
    reply.headers({
      "Content-Type": `text/html`,
      "set-cookie": `sessionID=${sessionID}; Path=/; SameSite=None; Secure; HttpOnly`,
    });
    return loginPage;
  });
  fastify.get("/register", (request, reply) => {
    //create session id for tracking webauthn challenges used for verification. Send session id as cookie
    const registrationPage = readFileSync(
      "./client/auth/registrationPage.html"
    );
    reply.headers({
      "Content-Type": `text/html`,
    });
    return registrationPage;
  });
  fastify.get("/profile", (request, reply) => {
    const profilePage = readFileSync("./client/auth/profilePage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return profilePage;
  });
  fastify.get("/recovery", (request, reply) => {
    const recoveryPage = readFileSync("./client/auth/recoveryPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return recoveryPage;
  });
  fastify.get("/home", (request, reply) => {
    const homePage = readFileSync("./client/auth/homePage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return homePage;
  });

  fastify.get("/styles/main.css", (request, reply) => {
    const homePage = readFileSync("./client/dist/main.css");
    reply.headers({
      "Content-Type": `text/css`,
    });
    return homePage;
  });
};

export default webRoutes;
