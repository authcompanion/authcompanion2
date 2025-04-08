export const refreshSchema = {
  schema: {
    description: "post some data",
    tags: ["Auth API"],
    summary: "qwerty",
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
