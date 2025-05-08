export const profileSchema = {
  schema: {
    description: "Enpoint that powers the public web form for updating a user's profile",
    tags: ["Auth API"],
    summary: "Update the User Account",
    schema: {
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
                    additionalProperties: true,
                    default: {},
                  },
                },
                minProperties: 1, // Requires at least one property in attributes
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
                    updated: { type: "string", format: "date-time" },
                    access_token: { type: "string" },
                    access_token_expiry: { type: "string" },
                  },
                  required: ["name", "email", "created", "updated", "access_token", "access_token_expiry"],
                },
              },
              required: ["type", "id", "attributes"],
            },
          },
          required: ["data"],
        },
      },
    },
  },
};
