import { readFileSync, existsSync } from "fs";
import Database from "better-sqlite3";
import config from "../config.js";
import fastifyPlugin from "fastify-plugin";

const dbfunc = async function connectDB(fastify, options) {
  let db = {};
  try {
    //create test database if just testing the application
    if (options.testdb) {
      config.DBPATH = "./test.db";
      db = new Database(config.DBPATH);

      const migration = readFileSync("./db/1__main.sql", "utf8");
      db.exec(migration);
      console.log("Test database - CREATED");
    }

    //make sure the database is available
    if (!existsSync(config.DBPATH)) {
      //create database if it does clearnot exist and migrate
      db = new Database(config.DBPATH);

      console.log("Sqlite3 database - CREATED");

      const migration = readFileSync("./db/1__main.sql", "utf8");
      db.exec(migration);
    } else {
      db = new Database(config.DBPATH);

      //if the database is available, make sure it has the right schema
      const stmt = db.prepare("SELECT version from authc_version");
      const { version } = stmt.get();

      if (!version || version !== 1) {
        throw new Error("Database is an unexpected version, please try again");
      }
    }
    console.log("Sqlite3 database - READY");
  } catch (error) {
    console.log(error);
    throw new Error(
      "There was an error setting and connecting up the Database, please try again!"
    );
  }
  //make available the database across the server by calling "connectdb"
  // fastify.decorate("connectdb", function () {
  //   return new Database(config.DBPATH);
  // });
};
//wrap the function with the fastly plugin to expose outside of the registered scope
export default fastifyPlugin(dbfunc);
