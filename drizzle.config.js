import config from "./config.js";

export default {
  schema: "./db/sqlite/schema.js",
  out: "./db/sqlite",
  driver: "better-sqlite",
  dbCredentials: {
    url: `${config.DBPATH}`, // 👈 this could also be a path to the local sqlite file
  },
};
