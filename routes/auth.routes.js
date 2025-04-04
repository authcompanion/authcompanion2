import { registrationHandler } from "../services/auth/registration.js";
import { registrationSchema } from "../services/auth/schemas/registrationSchema.js";

import { loginSchema } from "../services/auth/schemas/loginSchema.js";
import { loginHandler } from "../services/auth/login.js";

import { profileSchema } from "../services/auth/schemas/profileSchema.js";
import { profileHandler } from "../services/auth/profile.js";

import { recoverySchema } from "../services/auth/schemas/recoverySchema.js";
import { recoveryHandler } from "../services/auth/recovery.js";

import { tokenRefreshDeleteHandler, tokenRefreshHandler } from "../services/auth/refresh.js";
import { refreshSchema } from "../services/auth/schemas/refreshSchema.js";

import { registrationOptionsHandler } from "../services/webAuthn/registrationOptions.js";
import { registrationVerificationHandler } from "../services/webAuthn/registrationVerification.js";
import { loginOptionsHandler } from "../services/webAuthn/loginOptions.js";
import { loginVerificationHandler } from "../services/webAuthn/loginVerification.js";

import { loginVerificationSchema } from "../services/webAuthn/schemas/loginVerificationSchema.js";
import { registerVerificationSchema } from "../services/webAuthn/schemas/registerVerificationSchema.js";

import { authenticateAuthRequest } from "../utils/authenticate.js";

const authRoutes = async function (fastify, options) {
  //authentication API routes
  fastify.post("/register", registrationSchema, registrationHandler);
  fastify.post("/login", loginSchema, loginHandler);
  fastify.post("/users/me", { onRequest: [authenticateAuthRequest], ...profileSchema }, profileHandler);
  fastify.post("/recovery", recoverySchema, recoveryHandler);
  fastify.post("/refresh", refreshSchema, tokenRefreshHandler);
  fastify.delete("/refresh", refreshSchema, tokenRefreshDeleteHandler);

  //webAuthn API routes
  fastify.get("/registration-options", registrationOptionsHandler);
  fastify.post("/registration-verification", registerVerificationSchema, registrationVerificationHandler);
  fastify.get("/login-options", loginOptionsHandler);
  fastify.post("/login-verification", loginVerificationSchema, loginVerificationHandler);
};

export default authRoutes;
