import config from "../../../config.js";

export const logoutHandler = async function (request, reply) {
  try {
    reply.headers({
      "set-cookie": [`adminDashboardAccessToken=; Path=/; Expires=;`],
      "x-authc-app-origin": config.ADMINORIGIN,
    });

    reply.code(204);
  } catch (err) {
    throw { statusCode: err.statusCode, message: err.message };
  }
};
