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
                active: { type: "string" },
                metadata: { type: "object" },
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
