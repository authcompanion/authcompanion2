export const listUsersSchema = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        "page[size]": { type: "integer" },
        "page[number]": { type: "integer" },
      },
    },
  },
};
