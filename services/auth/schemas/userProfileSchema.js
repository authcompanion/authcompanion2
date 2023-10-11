export const userProfileSchema = {
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
