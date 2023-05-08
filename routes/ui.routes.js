import { readFileSync } from "fs";
import { randomUUID } from "crypto";

const webRoutes = async function (fastify, options) {
  fastify.get("/login", (request, reply) => {
    //create session id for tracking webauthn challenges used for verification. Send session id as cookie
    const sessionID = randomUUID();
    const loginPage = readFileSync("./ui/auth/loginPage.html");
    reply.headers({
      "Content-Type": `text/html`,
      "set-cookie": `sessionID=${sessionID}; Path=/; SameSite=None; Secure; HttpOnly`,
    });
    return loginPage;
  });
  fastify.get("/register", (request, reply) => {
    //create session id for tracking webauthn challenges used for verification. Send session id as cookie
    const registrationPage = readFileSync("./ui/auth/registrationPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return registrationPage;
  });
  fastify.get("/profile", (request, reply) => {
    const profilePage = readFileSync("./ui/auth/profilePage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return profilePage;
  });
  fastify.get("/recovery", (request, reply) => {
    const recoveryPage = readFileSync("./ui/auth/recoveryPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return recoveryPage;
  });
  fastify.get("/home", (request, reply) => {
    const homePage = readFileSync("./ui/auth/homePage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return homePage;
  });
};

export default webRoutes;
