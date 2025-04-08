export const logoutSchema = {
  schema: {
    description: "post some data",
    tags: ["Admin API"],
    summary: "qwerty",
    params: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          format: "uuid",
        },
      },
      required: ["uuid"],
    },
    response: {
      204: {
        description: "Logout successful with cookie invalidation",
        type: "null",
        headers: {
          type: "object",
          properties: {
            "set-cookie": {
              type: "string",
              pattern:
                "^adminRefreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=\\w+; HttpOnly(; Secure)?$",
            },
            "x-authc-app-origin": {
              type: "string",
            },
            "Clear-Site-Data": {
              type: "string",
              const: '"cookies", "storage"',
            },
          },
          required: ["set-cookie", "x-authc-app-origin", "Clear-Site-Data"],
        },
      },
    },
  },
};
