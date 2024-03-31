import fastifyPlugin from "fastify-plugin";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import { migrate as postgresMigrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle as sqliteDrizzle } from "drizzle-orm/better-sqlite3";
import { migrate as sqliteMigrate } from "drizzle-orm/better-sqlite3/migrator";
import postgres from "postgres";
import Database from "better-sqlite3";
import config from "../config.js";

// PostgreSQL schema
import * as postgresSchema from "./postgres/schema.js";
// SQLite schema
import * as sqliteSchema from "./sqlite/schema.js";

const dbPlugin = async function (fastify) {
  let db, users, authenticator, storage;

  try {
    if (config.POSTGRESQL_ENABLED) {
      const migrationClient = postgres(config.POSTGRESQL_CONNECTION_STRING, {
        max: 1,
        onnotice: () => {}, // Ignore NOTICE messages
      });

      await postgresMigrate(postgresDrizzle(migrationClient), { migrationsFolder: "./db/postgres" });

      db = postgresDrizzle(migrationClient);
      users = postgresSchema.users;
      authenticator = postgresSchema.authenticator;
      storage = postgresSchema.storage;

      fastify.log.info("Using PostgreSQL Database");
    } else if (config.SQLITE_ENABLED) {
      if (process.env.NODE_ENV === "test") {
        config.SQLITE_DB_PATH = "./test.db";
        fastify.log.info("Test database - ENABLED");
      }

      const migrationClient = new Database(config.SQLITE_DB_PATH);
      sqliteMigrate(sqliteDrizzle(migrationClient), { migrationsFolder: "./db/sqlite" });
      db = sqliteDrizzle(migrationClient);
      users = sqliteSchema.users;
      authenticator = sqliteSchema.authenticator;
      storage = sqliteSchema.storage;

      fastify.log.info(`Using SQLite Database: ${config.SQLITE_DB_PATH}`);
    } else {
      throw new Error("Neither PostgreSQL nor SQLite is enabled in the configuration.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }

  fastify.decorate("db", db);
  fastify.decorate("users", users);
  fastify.decorate("authenticator", authenticator);
  fastify.decorate("storage", storage);
};

export default fastifyPlugin(dbPlugin, { fastify: "4.x" });
