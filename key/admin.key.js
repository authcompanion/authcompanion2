import fastifyPlugin from "fastify-plugin";
import config from "../config.js";
import { users } from "../db/sqlite/schema.js";
import { writeFileSync } from "fs";
import { createId } from "@paralleldrive/cuid2";
import { createHash } from "../utils/credential.js";
import * as crypto from "crypto";
import { eq, sql } from "drizzle-orm";

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
    const adminUser = await fastify.db.select({ name: users.name }).from(users).where(eq(users.active, 1)).get();

    if (adminUser) {
      //register the admin user on the fastify instance
      //fastify.decorate("registeredAdminUser", adminUser);
      return;
    }

    //Create the default admin user in the Database, set the password to a random UUID as a placeholder
    const uuid = createId();
    const adminPwd = generatePassword();
    const hashPwd = await createHash(adminPwd);

    //Create a default admin user account
    const userObj = {
      uuid: uuid,
      name: "admin",
      email: "admin@localhost",
      password: hashPwd,
      active: 1,
      isAdmin: 1,
      created_at: sql`DATETIME('now')`,
    };

    await fastify.db.insert(users).values({ ...userObj });

    //export admin password to a file. Admin password is only exported once on server startup and can be traded for an access token
    writeFileSync(config.ADMINKEYPATH, `admin email: ${userObj.email} \nadmin password: ${adminPwd}`);
    fastify.log.info(`Generated Admin API Key here: ${config.ADMINKEYPATH}...`);
    fastify.log.info(`Admin Email: ${userObj.email} & Password: ${adminPwd}`);

    //register the admin user on the fastify instance
    // fastify.decorate("registeredAdminUser", user);

    fastify.log.info(`Using Admin API Key: ${config.ADMINKEYPATH}`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to export the admin key");
  }
};

//Wrap as Fastify Plugin
export default fastifyPlugin(setupAdminKey, { fastify: "4.x" });
