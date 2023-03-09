import fastifyPlugin from "fastify-plugin";
import config from "../../config.js";
import { writeFileSync } from "fs";
import { makeAccesstoken } from "../../utilities/jwt.js";
import { randomUUID } from "crypto";
import { hashPassword } from "../../utilities/credential.js";
import * as crypto from "crypto";

//function to generate a random password using crypto module
const generatePassword = function () {
  return crypto.randomBytes(20).toString("hex");
};

const setupAdminKey = async function (fastify) {
  try {
    //Check if the admin user already exists on server startup
    const stmt = fastify.db.prepare("SELECT * FROM users WHERE email = ?;");
    const adminUser = await stmt.get("admin@localhost");

    if (adminUser) {
      console.log("Admin API key - READY");
      return;
    }

    //Create the default admin user in the Database, set the password to a random UUID as a placeholder
    const uuid = randomUUID();
    const adminPwd = generatePassword();
    const hashPwd = await hashPassword(adminPwd);

    //Create a user object to use to create the user in the database and access token
    const userObj = {
      uuid: uuid,
      name: "Admin",
      email: "admin@localhost",
    };

    const registerStmt = fastify.db.prepare(
      "INSERT INTO users (uuid, name, email, password, active, jwt_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'), strftime('%Y-%m-%dT%H:%M:%fZ','now')) RETURNING uuid, name, email, active, created_at, updated_at;"
    );
    const user = registerStmt.get(
      uuid,
      userObj.name,
      userObj.email,
      hashPwd,
      1,
      ""
    );

    //make access token use to authenticate into the Admin API
    const adminAccessToken = await makeAccesstoken(userObj, fastify.key);

    //export access token to file
    writeFileSync(
      config.ADMINKEYPATH,
      `access token: ${adminAccessToken.token}\nadmin password: ${adminPwd}`
    );
    console.log("Admin API key - READY");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to export the admin key");
  }
};

//Wrap as Fastify Plugin
export default fastifyPlugin(setupAdminKey, { fastify: "4.x" });
