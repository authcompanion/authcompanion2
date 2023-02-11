import fastifyPlugin from "fastify-plugin";
import config from "../../config.js";
import { writeFileSync } from "fs";
import { makeAccesstoken } from "../../utilities/jwt.js";

const setupAdminKey = async function (fastify) {
  try {
    const userObj = {
      uuid: 1,
      name: "Admin",
      email: "admin@localhost",
    };

    //make access token use to authenticate into the Admin API
    const adminAccessToken = await makeAccesstoken(userObj, fastify.key);

    //export access token to file
    writeFileSync(config.ADMINKEYPATH, adminAccessToken.token);
    
  } catch (error) {
    console.log(error);
    throw new Error("Failed to export the admin key");
  }
};

//Wrap as Fastify Plugin
export default fastifyPlugin(setupAdminKey, { fastify: "4.x" });
