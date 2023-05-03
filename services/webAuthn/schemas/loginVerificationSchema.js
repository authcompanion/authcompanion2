export const loginVerificationSchema = {
  body: {
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
        required: ["authenticatorData", "clientDataJSON", "signature"],
        additionalProperties: false,
      },
      type: { type: "string" },
      clientExtensionResults: { type: "object" },
      authenticatorAttachment: { type: "string" },
    },
    required: ["id", "rawId", "response", "type"],
    additionalProperties: false,
  },
};
