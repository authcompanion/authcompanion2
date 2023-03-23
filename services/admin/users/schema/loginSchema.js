export const loginSchema = {
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
                password: { type: "string" },
              },
              required: ["password"],
            },
          },
          required: ["type", "attributes"],
        },
      },
      required: ["data"],
    },
  },
};
