export const registrationSchema = {
  schema: {
    description: "post some data",
    tags: ["Auth API"],
    summary: "qwerty",
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["users"] },
            attributes: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 2 },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 8 },
                metadata: {
                  type: "object",
                  default: {},
                  additionalProperties: true,
                },
              },
              required: ["name", "email", "password"],
            },
          },
          required: ["type", "attributes"],
        },
      },
      required: ["data"],
    },
    response: {
      201: {
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
