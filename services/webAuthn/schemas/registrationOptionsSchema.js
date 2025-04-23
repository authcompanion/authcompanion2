// registrationOptionsSchema.js
export const registrationOptionsSchema = {
  schema: {
    description: "Generate WebAuthn registration options",
    tags: ["WebAuthn API"],
    summary: "Start WebAuthn registration process",
    security: [], // Explicitly mark as unauthenticated endpoint

    // Request validation
    body: {
      type: "object",
      required: ["name", "email"],
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 64,
        },
        email: {
          type: "string",
          format: "email",
          maxLength: 254,
        },
      },
    },

    // Response validation
    response: {
      200: {
        type: "object",
        properties: {
          challenge: { type: "string" },
          rp: {
            type: "object",
            properties: {
              name: { type: "string" },
              id: { type: "string" },
            },
            required: ["name", "id"],
          },
          user: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              displayName: { type: "string" },
            },
            required: ["id", "name", "displayName"],
          },
          pubKeyCredParams: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["public-key"] },
                alg: { type: "number" },
              },
              required: ["type", "alg"],
            },
          },
          timeout: { type: "number" },
          authenticatorSelection: {
            type: "object",
            properties: {
              userVerification: { type: "string", enum: ["required", "preferred", "discouraged"] },
              residentKey: { type: "string", enum: ["required", "preferred", "discouraged"] },
            },
          },
        },
        required: ["challenge", "rp", "user", "pubKeyCredParams"],
      },
    },
  },
};
