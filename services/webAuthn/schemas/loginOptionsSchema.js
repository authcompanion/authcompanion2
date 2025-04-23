// loginOptionsSchema.js
export const loginOptionsSchema = {
  schema: {
    description: "Generate WebAuthn authentication options",
    tags: ["WebAuthn API"],
    summary: "Start WebAuthn authentication process",
    security: [], // Explicitly mark as unauthenticated endpoint

    // Response validation
    response: {
      200: {
        type: "object",
        properties: {
          sessionID: {
            type: "string",
            format: "uuid",
            description: "Ephemeral session identifier for passkey verification",
          },
          challenge: {
            type: "string",
            description: "WebAuthn cryptographic challenge",
          },
          rpId: {
            type: "string",
            description: "Relying Party Identifier",
          },
          timeout: {
            type: "number",
            description: "Authentication flow timeout in milliseconds",
          },
          userVerification: {
            type: "string",
            enum: ["required", "preferred", "discouraged"],
            description: "User verification requirement level",
          },
          allowCredentials: {
            type: "array",
            description: "Optional list of allowed credential IDs",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["public-key"],
                },
                id: {
                  type: "string",
                  description: "Base64URL encoded credential ID",
                },
                transports: {
                  type: "array",
                  description: "List of supported transport protocols",
                  items: {
                    type: "string",
                    enum: ["usb", "nfc", "ble", "internal"],
                  },
                },
              },
              required: ["type", "id"],
            },
          },
        },
        required: ["sessionID", "challenge", "rpId", "timeout", "userVerification"],
      },
    },
  },
};
