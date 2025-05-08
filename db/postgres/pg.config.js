import config from "../../config.js";

export default {
  schema: "./db/postgres/pg.schema.js",
  out: "./db/postgres",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: "5432",
    user: "paulfish",
    password: "",
    database: "paulfish",
    ssl: false,
  },
};
