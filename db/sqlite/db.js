import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import config from "../../config.js";
import fastifyPlugin from "fastify-plugin";

const sqlitePlugin = async function (fastify) {
  let db = {};
  try {
    //create test database to support CI
    if (process.env.NODE_ENV === "test") {
      config.DBPATH = "./test.db";
      fastify.log.info("Test database - ENABLED");
    }
    const sqlite = new Database(`${config.DBPATH}`);
    db = drizzle(sqlite);

    migrate(db, { migrationsFolder: "./db/sqlite" });
  } catch (error) {
    console.log(error);
  }

  //make available the database across the server by calling "db"
  fastify.decorate("db", db);
  fastify.log.info(`Using Sqlite3 Database: ${config.DBPATH}`);
};
//wrap the function with the fastly plugin to expose outside of the registered scope
export default fastifyPlugin(sqlitePlugin, { fastify: "4.x" });
