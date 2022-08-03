export const profileRecoverySchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
      },
      required: ["email"],
    },
  },
};
