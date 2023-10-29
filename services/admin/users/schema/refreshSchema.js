export const refreshSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        refreshToken: { type: "string" }, // Add refreshToken property validation
      },
      required: ["refreshToken"], // Mark refreshToken as required
    },
  },
};
