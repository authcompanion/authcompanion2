export const loginSchema = {
  schema: {
    description: "Enpoint that powers the public web form for user login",
    tags: ["Auth API"],
    summary: "Login a User Account",
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            attributes: {
              type: "object",
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
          required: ["type", "attributes"],
        },
      },
      required: ["data"],
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
