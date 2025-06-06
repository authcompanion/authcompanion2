export const deleteSchema = {
  schema: {
    description: "Enpoint that enables admins to delete user accounts",
    tags: ["Admin API"],
    summary: "Delete User Accounts",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
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
