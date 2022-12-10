import fastifyPlugin from "fastify-plugin";
import { validateJWT } from "./jwt.js";

const authenticatePlugin = async (fastify, options) => {
  //make available "fastify.authenticate" function on the instance
  fastify.decorate("authenticateUser", async function (request, reply) {
    let requestToken = {};
    try {
      //check if the request includes an authorization header
      if (request.headers.authorization.startsWith("Bearer ")) {
        //extract the specific token value from the header
        requestToken = request.headers.authorization.substring(
          7,
          request.headers.authorization.length
        );
      } else {
        request.log.info("Missing access token in header");
        throw { statusCode: "401", message: "Unauthorized" };
      }
      //validate the token
      const payload = await validateJWT(requestToken, this.key);

      request.jwtRequestPayload = payload;
    } catch (error) {
      throw { statusCode: "401", message: "Unauthorized" };
    }
  });
};
//wrap the function with the fastly plugin to expose outside of the registered scope
export default fastifyPlugin(authenticatePlugin, { fastify: "4.x" });
