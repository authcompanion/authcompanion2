export const loginVerificationSchema = {
  schema: {
    description: "Verify WebAuthn authentication response",
    tags: ["WebAuthn API"],
    summary: "Complete WebAuthn authentication process",
    security: [],
    consumes: ["application/json"],

    body: {
      type: "object",
      properties: {
        sessionID: {
          type: "string",
          format: "uuid",
        },
        attResp: {
          type: "object",
          properties: {
            id: { type: "string" },
            rawId: { type: "string" },
            response: {
              type: "object",
              properties: {
                authenticatorData: { type: "string" },
                clientDataJSON: { type: "string" },
                signature: { type: "string" },
                userHandle: { type: "string" },
              },
              required: ["authenticatorData", "clientDataJSON", "signature", "userHandle"],
              additionalProperties: false,
            },
            type: { type: "string", const: "public-key" },
            clientExtensionResults: {
              type: "object",
              default: {},
              additionalProperties: true,
            },
            authenticatorAttachment: {
              type: "string",
              enum: ["platform", "cross-platform"],
            },
          },
          required: ["id", "rawId", "response", "type"],
          additionalProperties: false,
        },
      },
      required: ["sessionID", "attResp"],
      additionalProperties: false,
    },

    // Response validation remains the same
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              type: { type: "string", const: "Login" },
              attributes: {
                type: "object",
                properties: {
                  uuid: { type: "string" },
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  jwt_id: { type: "string" },
                  created_at: { type: "string", format: "date-time" },
                  access_token: { type: "string" },
                  access_token_expiry: { type: "number" },
                },
                required: ["uuid", "name", "email", "jwt_id", "created_at", "access_token", "access_token_expiry"],
                additionalProperties: false,
              },
            },
            required: ["id", "type", "attributes"],
            additionalProperties: false,
          },
        },
        required: ["data"],
        additionalProperties: false,
      },
    },
  },
};
