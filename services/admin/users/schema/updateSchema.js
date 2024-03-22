export const updateSchema = {
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
                appdata: { type: "object" },
                active: { type: "number" },
                isAdmin: { type: "number" },
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
