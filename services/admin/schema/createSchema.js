export const createSchema = {
  schema: {
    description: "Enpoint that enables admins to create user accounts",
    tags: ["Admin API"],
    summary: "Create User Accounts",
    security: [{ bearerAuth: [] }],
    body: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            attributes: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                metadata: { type: "object" },
                appdata: { type: "object" },
                active: { type: "number" },
                isAdmin: { type: "number" },
              },
              required: ["name", "email", "password", "active"],
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
                  metadata: {
                    type: "object",
                    additionalProperties: true,
                  },
                  appdata: {
                    type: "object",
                    additionalProperties: true,
                  },
                  active: { type: "boolean" },
                  isAdmin: { type: "boolean" },
                  created: { type: "string", format: "date-time" },
                  updated: { type: "string", format: "date-time" },
                },
                required: ["name", "email", "active", "isAdmin", "created", "updated"],
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
