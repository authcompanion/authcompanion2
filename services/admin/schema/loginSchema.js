export const loginSchema = {
  schema: {
    description:
      "Enpoint that enables admins to login to the admin portal and/or recieve an admin Access Token to authenticate into the Admin APIs.",
    tags: ["Admin API"],
    summary: "Login Admins and recieve Admin Access Token for Admin APIs",
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["users"],
              default: "users",
            },
            attributes: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  maxLength: 255,
                },
                password: {
                  type: "string",
                  minLength: 8,
                  maxLength: 128,
                },
              },
              required: ["email", "password"],
              additionalProperties: false,
            },
          },
          required: ["type", "attributes"],
          additionalProperties: false,
        },
      },
      required: ["data"],
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
                  name: { type: "string" },
                  email: { type: "string" },
                  created: { type: "string", format: "date-time" },
                  access_token: { type: "string" },
                  access_token_expiry: {
                    type: "string",
                  },
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
