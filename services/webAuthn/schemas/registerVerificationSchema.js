export const registerVerificationSchema = {
  schema: {
    description: "Verify WebAuthn registration response",
    tags: ["WebAuthn API"],
    summary: "Complete WebAuthn registration process",
    security: [], // No traditional auth but requires user ID header
    consumes: ["application/json"],

    // Request validation
    headers: {
      type: "object",
      properties: {
        "x-authc-app-userid": {
          type: "string",
        },
      },
      required: ["x-authc-app-userid"],
    },

    body: {
      type: "object",
      properties: {
        id: { type: "string" },
        rawId: { type: "string" },
        response: {
          type: "object",
          properties: {
            attestationObject: { type: "string" },
            clientDataJSON: { type: "string" },
            transports: {
              type: "array",
              items: {
                type: "string",
                enum: ["usb", "nfc", "ble", "internal", "hybrid"],
              },
            },
          },
          required: ["attestationObject", "clientDataJSON"],
          additionalProperties: false,
        },
        type: { type: "string", const: "public-key" },
        clientExtensionResults: {
          type: "object",
          properties: {
            credProps: {
              type: "object",
              properties: {
                rk: { type: "boolean" },
              },
              additionalProperties: false,
            },
          },
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

    // Response validation
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              type: { type: "string", const: "users" },
              attributes: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  created: { type: "string", format: "date-time" },
                  access_token: { type: "string" },
                  access_token_expiry: { type: "number" },
                },
                required: ["name", "email", "created", "access_token", "access_token_expiry"],
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
