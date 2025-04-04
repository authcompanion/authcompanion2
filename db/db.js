import fastifyPlugin from "fastify-plugin";
import { drizzle as postgresDrizzle } from "drizzle-orm/postgres-js";
import { migrate as postgresMigrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle as sqliteDrizzle } from "drizzle-orm/better-sqlite3";
import { migrate as sqliteMigrate } from "drizzle-orm/better-sqlite3/migrator";
import postgres from "postgres";
import Database from "better-sqlite3";
import config from "../config.js";

// Database configurations
const dbConfig = {
  postgresql: {
    enabled: config.POSTGRESQL_ENABLED,
    drizzle: postgresDrizzle,
    migrate: postgresMigrate,
    schema: import("./postgres/pg.schema.js"),
    migrationsFolder: "./db/postgres",
    getClient: () =>
      postgres(config.POSTGRESQL_CONNECTION_STRING, {
        max: 1,
        onnotice: () => {},
      }),
  },
  sqlite: {
    enabled: config.SQLITE_ENABLED,
    drizzle: sqliteDrizzle,
    migrate: sqliteMigrate,
    schema: import("./sqlite/sqlite.schema.js"),
    migrationsFolder: "./db/sqlite",
    getClient: () => new Database(process.env.NODE_ENV === "test" ? "./test.db" : config.SQLITE_DB_PATH),
  },
};

const databasePlugin = async function (fastify) {
  try {
    // Determine which database to use
    const dbType = Object.keys(dbConfig).find((type) => dbConfig[type].enabled);
    if (!dbType) throw new Error("No database enabled in configuration");

    const { drizzle, migrate, schema, migrationsFolder, getClient } = dbConfig[dbType];

    // Initialize database
    const migrationClient = getClient();
    if (dbType === "postgresql") {
      await migrate(drizzle(migrationClient), { migrationsFolder });
    } else {
      migrate(drizzle(migrationClient), { migrationsFolder });
    }

    // Assign schema components
    const { users, authenticator, storage } = await schema;

    // Decorate Fastify instance
    fastify.decorate("db", drizzle(migrationClient));
    fastify.decorate("users", users);
    fastify.decorate("authenticator", authenticator);
    fastify.decorate("storage", storage);

    console.log(dbType === "sqlite" ? `Using SQLite Database: ${config.SQLITE_DB_PATH}` : "Using PostgreSQL Database");
  } catch (err) {
    console.log("Error initializing database:", err);
    process.exit(1);
  }
};

export default fastifyPlugin(databasePlugin, { fastify: "5.x" });
