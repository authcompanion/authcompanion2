export const updateSchema = {
  schema: {
    description: "post some data",
    tags: ["Admin API"],
    summary: "qwerty",
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
                name: {
                  type: "string",
                  minLength: 2,
                  maxLength: 255,
                },
                email: {
                  type: "string",
                  format: "email",
                  maxLength: 255,
                },
                password: {
                  type: "string",
                  minLength: 8,
                  maxLength: 128,
                },
                metadata: {
                  type: "object",
                  additionalProperties: true,
                },
                appdata: {
                  type: "object",
                  additionalProperties: true,
                },
                active: {
                  type: "number",
                  enum: [0, 1],
                },
                isAdmin: {
                  type: "number",
                  enum: [0, 1],
                },
              },
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
                  email: { type: "string", format: "email" },
                  metadata: {
                    type: "object",
                    additionalProperties: true,
                  },
                  appdata: {
                    type: "object",
                    additionalProperties: true,
                  },
                  active: { type: "number", enum: [0, 1] },
                  isAdmin: { type: "number", enum: [0, 1] },
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
