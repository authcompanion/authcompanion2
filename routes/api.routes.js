import { registrationHandler } from "../services/registration.js";
import { registrationSchema } from "../services/schemas/registrationSchema.js";

import { loginSchema } from "../services/schemas/loginSchema.js";
import { loginHandler } from "../services/login.js";

import { userProfileSchema } from "../services/schemas/userProfileSchema.js";
import { userProfileHandler } from "../services/profile.js";

import { profileRecoverySchema } from "../services/schemas/profileRecoverySchema.js";
import { profileRecoveryHandler } from "../services/recovery.js";

import { tokenRefreshHandler } from "../services/refresh.js";
//import { refreshSchema } from "../services/schemas/refreshSchema.js";
//import fastifyPlugin from "fastify-plugin";

const serverRoutes = async function (fastify, options) {
  fastify.post("/register", registrationSchema, registrationHandler);
  fastify.post("/login", loginSchema, loginHandler);
  fastify.post(
    "/users/me",
    { onRequest: [fastify.authenticateUser], ...userProfileSchema },
    userProfileHandler
  );
  fastify.post("/recovery", profileRecoverySchema, profileRecoveryHandler);
  fastify.post("/refresh", tokenRefreshHandler);
};

//Wrap with Fastify Plugin
//export default fastifyPlugin(serverRoutes);
export default serverRoutes;
