export const refreshSchema = {
  schema: {
    description: "Endpoint that enables refreshing of the Admin Access Token.",
    tags: ["Admin API"],
    summary: "Refresh Admin Access Token",
    body: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
          // pattern: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$", // JWT pattern
          // minLength: 128,
          // maxLength: 512,
        },
      },
      required: ["refreshToken"],
      additionalProperties: false,
    },
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["users"] },
              id: { type: "string", format: "uuid" },
              attributes: {
                type: "object",
                properties: {
                  access_token_expiry: {
                    type: "string",
                  },
                },
                required: ["access_token_expiry"],
              },
            },
            required: ["type", "id", "attributes"],
          },
        },
        required: ["data"],
      },
    },
  },
};
