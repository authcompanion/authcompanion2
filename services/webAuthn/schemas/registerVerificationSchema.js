export const registerVerificationSchema = {
  schema: {
    description: "post some data",
    tags: ["WebAuthn API"],
    summary: "qwerty",
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
            transports: { type: "array", items: { type: "string" } },
          },
          required: ["attestationObject", "clientDataJSON"],
        },
        type: { type: "string" },
        clientExtensionResults: {
          type: "object",
          properties: {
            credProps: { type: "object", additionalProperties: false },
          },
        },
        authenticatorAttachment: { type: "string" },
      },
      required: ["id", "rawId", "response", "type"],
      additionalProperties: false,
    },
  },
};
