export const listUsersSchema = {
  schema: {
    description: "Enpoint that enables admins to list user accounts",
    tags: ["Admin API"],
    summary: "List User Accounts",
    querystring: {
      type: "object",
      properties: {
        "page[size]": {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 10,
        },
        "page[number]": {
          type: "integer",
          minimum: 1,
          default: 1,
        },
        "search[email]": {
          type: "string",
          maxLength: 255,
        },
      },
      additionalProperties: false,
    },
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["users"] },
                id: { type: "string", format: "uuid" },
                attributes: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    metadata: { type: "object" },
                    appdata: { type: "object" },
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
          links: {
            type: "object",
            properties: {
              first: { type: "string", format: "uri-reference" },
              last: { type: "string", format: "uri-reference" },
              prev: { type: ["string", "null"], format: "uri-reference" },
              next: { type: ["string", "null"], format: "uri-reference" },
            },
            required: ["first", "last"],
          },
          meta: {
            type: "object",
            properties: {
              pagination: {
                type: "object",
                properties: {
                  total: { type: "integer", minimum: 0 },
                  pages: { type: "integer", minimum: 0 },
                  current: { type: "integer", minimum: 1 },
                  size: { type: "integer", minimum: 1 },
                },
                required: ["total", "pages", "current", "size"],
              },
            },
            required: ["pagination"],
          },
        },
        required: ["data", "links", "meta"],
      },
    },
  },
};
