import fastifyPlugin from "fastify-plugin";
import config from "../config.js";
import { writeFileSync } from "fs";
import { init } from "@paralleldrive/cuid2";
import { createHash } from "../utils/credential.js";
import * as crypto from "crypto";
import { eq } from "drizzle-orm";

//function to generate a random password using crypto module
const generatePassword = function () {
  return crypto.randomBytes(20).toString("hex");
};

const setupAdminKey = async function (fastify) {
  try {
    //create test database to support CI
    if (process.env.NODE_ENV === "test") {
      config.ADMINKEYPATH = "./adminkey_test";
    }

    //check if the admin user already exists on server startup
    const adminUser = await fastify.db
      .select({ name: fastify.users.name })
      .from(fastify.users)
      .where(eq(fastify.users.email, "admin@localhost"));

    if (adminUser.length > 0) {
      return;
    }

    //Create the default admin user in the Database, set the password to a random UUID as a placeholder
    const createId = init({ length: 10 });
    const uuid = createId();
    const adminPwd = generatePassword();
    const hashPwd = await createHash(adminPwd);
    const now = new Date().toISOString(); // Create a Date object with the current date and time

    //Create a default admin user account
    const userObj = {
      uuid: uuid,
      name: "admin",
      email: "admin@localhost",
      password: hashPwd,
      active: true,
      isAdmin: true,
      created_at: now,
      updated_at: now,
    };

    await fastify.db.insert(fastify.users).values({ ...userObj });

    //export admin password to a file. Admin password is only exported once on server startup and can be traded for an access token
    writeFileSync(config.ADMINKEYPATH, `admin email: ${userObj.email} \nadmin password: ${adminPwd}`);
    fastify.log.info(`Using Admin API Key: ${config.ADMINKEYPATH}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to export the admin key");
  }
};

//Wrap as Fastify Plugin
export default fastifyPlugin(setupAdminKey, { fastify: "5.x" });
