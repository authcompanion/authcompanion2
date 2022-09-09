//import fastifyPlugin from "fastify-plugin";
import { readFileSync } from "fs";

const webRoutes = async function (fastify, options) {
  fastify.get("/login", (request, reply) => {
    const loginPage = readFileSync("./ui/loginPage.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return loginPage;
  });
  fastify.get("/register", (request, reply) => {
    const registrationPage = readFileSync("./ui/registrationPage.html");
    reply.headers({
      "Content-Type": `text/html`,
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
  fastify.get("/webauthn", (request, reply) => {
    const homePage = readFileSync("./ui/webauthn.html");
    reply.headers({
      "Content-Type": `text/html`,
    });
    return homePage;
  });
};

//Wrap with Fastify Plugin
//export default fastifyPlugin(webRoutes);
export default webRoutes;
