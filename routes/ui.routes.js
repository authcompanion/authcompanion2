import { readFileSync } from "fs";
import { randomUUID } from "crypto";

const webRoutes = async function (fastify, options) {
  fastify.get("/login", (request, reply) => {
    //create session id for tracking webauthn challenges used for verification. Send session id as cookie
    const sessionID = randomUUID();
    const loginPage = readFileSync("./ui/loginPage.html");
    reply.headers({
      "Content-Type": `text/html`,
      "set-cookie": `sessionID=${sessionID}; Path=/; SameSite=None; Secure; HttpOnly`,
    });
    return loginPage;
  });
  fastify.get("/register", (request, reply) => {
    //create session id for tracking webauthn challenges used for verification. Send session id as cookie
    const sessionID = randomUUID();
    const registrationPage = readFileSync("./ui/registrationPage.html");
    reply.headers({
      "Content-Type": `text/html`,
      "set-cookie": `sessionID=${sessionID}; Path=/; SameSite=None; Secure; HttpOnly`,
    });
    return registrationPage;
  });
  fastify.get("/profile", (request, reply) => {
    const profilePage = readFileSync("./ui/profilePage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return profilePage;
  });
  fastify.get("/recovery", (request, reply) => {
    const recoveryPage = readFileSync("./ui/recoveryPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return recoveryPage;
  });
  fastify.get("/home", (request, reply) => {
    const homePage = readFileSync("./ui/homePage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return homePage;
  });
};

export default webRoutes;
