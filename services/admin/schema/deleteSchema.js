export const deleteSchema = {
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
        description: "User deleted successfully",
        type: "null",
      },
    },
  },
};
