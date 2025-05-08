export const recoverySchema = {
  schema: {
    description: "Enpoint that powers the public web form for recoverying a user account",
    tags: ["Auth API"],
    summary: "Recovery a User Account",
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["users"],
            },
            attributes: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
              },
              required: ["email"],
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
              type: {
                type: "string",
                enum: ["users"],
              },
              detail: {
                type: "string",
                pattern: "^Recovery email sent$",
              },
            },
            required: ["type", "detail"],
          },
        },
        required: ["data"],
      },
    },
  },
};
