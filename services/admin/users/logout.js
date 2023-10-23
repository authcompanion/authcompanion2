import config from "../../../config.js";

export const logoutHandler = async function (request, reply) {
  try {
    
    reply.headers({
      "x-authc-app-origin": config.ADMINORIGIN,
    });

    return {
      data: {
        logout: true,
      },
    };
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
