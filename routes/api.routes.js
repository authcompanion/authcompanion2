import { registrationHandler } from "../services/registration.js";
import { registrationSchema } from "../services/schemas/registrationSchema.js";

import { loginSchema } from "../services/schemas/loginSchema.js";
import { loginHandler } from "../services/login.js";

import { userProfileSchema } from "../services/schemas/userProfileSchema.js";
import { userProfileHandler } from "../services/profile.js";

import { profileRecoverySchema } from "../services/schemas/profileRecoverySchema.js";
import { profileRecoveryHandler } from "../services/recovery.js";

import { tokenRefreshHandler } from "../services/refresh.js";
import { refreshSchema } from "../services/schemas/refreshSchema.js";

import { registrationOptionsHandler } from "../services/webAuthn/registrationOptions.js";
import { registrationVerificationHandler } from "../services/webAuthn/registrationVerification.js";
import { loginOptionsHandler } from "../services/webAuthn/loginOptions.js";
import { loginVerificationHandler } from "../services/webAuthn/loginVerification.js";

const serverRoutes = async function (fastify, options) {
  //auth API routes
  fastify.post("/register", registrationSchema, registrationHandler);
  fastify.post("/login", loginSchema, loginHandler);
  fastify.post(
    "/users/me",
    { onRequest: [fastify.authenticateUser], ...userProfileSchema },
    userProfileHandler
  );
  fastify.post("/recovery", profileRecoverySchema, profileRecoveryHandler);
  fastify.post("/refresh", refreshSchema, tokenRefreshHandler);

  //webAuthn routes
  fastify.get("/registration-options", registrationOptionsHandler);
  fastify.post("/registration-verification", registrationVerificationHandler);
  fastify.get("/login-options", loginOptionsHandler);
  fastify.post("/login-verification", loginVerificationHandler);
};

export default serverRoutes;
