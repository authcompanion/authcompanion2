export const updateSchema = {
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
            },
          },
          required: ["type", "attributes"],
        },
      },
      required: ["data"],
    },
  },
};
