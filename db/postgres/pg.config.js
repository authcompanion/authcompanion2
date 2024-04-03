import config from "../../config.js";

export default {
  schema: "./db/postgres/schema.js",
  out: "./db/postgres",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    port: "5432",
    user: "paulfish",
    password: "",
    database: "paulfish",
    ssl: false,
  },
};
