import { validateJWT } from "./jwt.js";

export const authenticateRequest = async function (request, reply) {
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
    //set request with jwt payload
    request.jwtRequestPayload = payload;
  } catch (error) {
    throw { statusCode: "401", message: "Unauthorized" };
  }
};
