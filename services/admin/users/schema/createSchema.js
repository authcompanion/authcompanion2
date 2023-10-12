export const createSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            attributes: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                metadata: { type: "object" },
                active: { type: "string" },
              },
              required: ["name", "email", "password", "active"],
            },
          },
          required: ["type", "attributes"],
        },
      },
      required: ["data"],
    },
  },
};
