export const refreshSchema = {
  schema: {
    description: "Enpoint that powers the helps you to refresh a user account's acess token when it expires",
    tags: ["Auth API"],
    summary: "Refresh a User's Access Token",
    body: {
      type: "object",
      properties: {},
      required: [],
      maxProperties: 0,
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
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  created: { type: "string", format: "date-time" },
                  access_token: { type: "string" },
                  access_token_expiry: { type: "string" },
                },
                required: ["name", "email", "created", "access_token", "access_token_expiry"],
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
