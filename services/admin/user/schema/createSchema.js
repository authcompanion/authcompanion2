export const createSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            name: { type: "string" },
            attributes: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
              },
              required: ["name", "email", "password"],
            },
          },
          required: ["type", "attributes"],
        },
      },
      required: ["data"],
    },
  },
};
