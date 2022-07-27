//import fastifyPlugin from "fastify-plugin";

const webRoutes = async function (fastify, options) {
  fastify.get("/login", (request, reply) => {
    return reply.sendFile("loginPage.html");
  });
  fastify.get("/register", (request, reply) => {
    return reply.sendFile("registrationPage.html");
  });
  fastify.get("/profile", (request, reply) => {
    return reply.sendFile("profilePage.html");
  });
  fastify.get("/recovery", (request, reply) => {
    return reply.sendFile("recoveryPage.html");
  });
  fastify.get("/home", (request, reply) => {
    return reply.sendFile("homePage.html");
  });
};

//Wrap with Fastify Plugin
//export default fastifyPlugin(webRoutes);
export default webRoutes;
