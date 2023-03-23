import config from "../../../config.js";

export const logoutHandler = async function (request, reply) {
  try {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime());

    reply.headers({
      "set-cookie": `adminAccessToken=; Path=/; Expires=${expireDate}; SameSite=None; Secure; HttpOnly`,
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
