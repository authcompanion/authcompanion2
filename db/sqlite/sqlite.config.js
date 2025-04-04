import config from "../../config.js";

export default {
  schema: "./db/sqlite/sqlite.schema.js",
  out: "./db/sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url: `${config.DBPATH}`,
  },
};
