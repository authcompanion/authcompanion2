import * as jose from "jose";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

// Constants for token configuration
const TOKEN_CONFIG = {
  USER: {
    issuer: "authcompanion",
    audience: "authcompanion-client",
    scope: "user",
    accessExpiration: "1h",
    refreshExpiration: "7d",
  },
  ADMIN: {
    issuer: "authcompanion-admin",
    audience: "authcompanion-admin-console",
    scope: "admin",
    accessExpiration: "1h",
    refreshExpiration: "7d",
  },
};

export async function verifyRefreshtoken(token, key) {
  try {
    const payload = await validateJWT(token, key);

    if (payload.iss !== TOKEN_CONFIG.USER.issuer) {
      throw new Error("Invalid issuer for refresh token");
    }

    return payload;
  } catch (error) {
    throw {
      statusCode: 401,
      message: "Refresh token validation failed",
      error: error.message,
      code: "INVALID_REFRESH_TOKEN",
    };
  }
}

export async function makeAccesstoken(userAcc, key) {
  try {
    const jwtid = randomUUID();

    const claims = {
      sub: userAcc.uuid,
      name: userAcc.name,
      email: userAcc.email,
      scope: TOKEN_CONFIG.USER.scope,
    };

    if (userAcc.metadata && userAcc.metadata !== "{}") {
      claims.metadata = userAcc.metadata;
    }

    if (userAcc.appdata && userAcc.appdata !== "{}") {
      claims.app = userAcc.appdata;
    }

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(TOKEN_CONFIG.USER.issuer)
      .setAudience(TOKEN_CONFIG.USER.audience)
      .setJti(jwtid)
      .setIssuedAt()
      .setExpirationTime(TOKEN_CONFIG.USER.accessExpiration)
      .sign(key);

    const { payload } = await jose.jwtVerify(jwt, key);

    return {
      token: jwt,
      expiration: payload.exp,
      jti: jwtid,
    };
  } catch (error) {
    throw { statusCode: 500, message: "JWT Generation Error", error };
  }
}

export async function makeRefreshtoken(userAcc, key, fastifyInstance, { recoveryToken = false } = {}) {
  try {
    const expirationTime = recoveryToken ? "15m" : TOKEN_CONFIG.USER.refreshExpiration;
    const jwtid = randomUUID();

    const claims = {
      sub: userAcc.uuid,
      name: userAcc.name,
      email: userAcc.email,
      scope: TOKEN_CONFIG.USER.scope,
      ...(recoveryToken && { recoveryToken: "true" }),
    };

    if (userAcc.metadata && userAcc.metadata !== "{}") {
      claims.metadata = userAcc.metadata;
    }

    if (userAcc.appdata && userAcc.appdata !== "{}") {
      claims.app = userAcc.appdata;
    }

    await fastifyInstance.db
      .update(fastifyInstance.users)
      .set({ jwt_id: jwtid })
      .where(eq(fastifyInstance.users.uuid, userAcc.uuid));

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(TOKEN_CONFIG.USER.issuer)
      .setAudience(TOKEN_CONFIG.USER.audience)
      .setJti(jwtid)
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(key);

    const { payload } = await jose.jwtVerify(jwt, key);

    return { token: jwt, expiration: payload.exp, jti: jwtid };
  } catch (error) {
    throw { statusCode: 500, message: "Refresh Token Generation Error", error };
  }
}

export async function makeAdminToken(adminUserAcc, key) {
  try {
    const jwtid = randomUUID();

    const claims = {
      sub: adminUserAcc.uuid,
      name: adminUserAcc.name,
      email: adminUserAcc.email,
      scope: TOKEN_CONFIG.ADMIN.scope,
    };

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(TOKEN_CONFIG.ADMIN.issuer)
      .setAudience(TOKEN_CONFIG.ADMIN.audience)
      .setJti(jwtid)
      .setIssuedAt()
      .setExpirationTime(TOKEN_CONFIG.ADMIN.accessExpiration)
      .sign(key);

    const { payload } = await jose.jwtVerify(jwt, key);

    return {
      token: jwt,
      expiration: payload.exp,
      jti: jwtid,
    };
  } catch (error) {
    throw { statusCode: 500, message: "Admin Token Generation Error", error };
  }
}

export async function makeAdminRefreshtoken(adminUserAcc, key, fastifyInstance) {
  try {
    const jwtid = randomUUID();

    const claims = {
      sub: adminUserAcc.uuid,
      name: adminUserAcc.name,
      email: adminUserAcc.email,
      scope: TOKEN_CONFIG.ADMIN.scope,
    };

    await fastifyInstance.db
      .update(fastifyInstance.users)
      .set({ jwt_id: jwtid })
      .where(eq(fastifyInstance.users.uuid, adminUserAcc.uuid));

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(TOKEN_CONFIG.ADMIN.issuer)
      .setAudience(TOKEN_CONFIG.ADMIN.audience)
      .setJti(jwtid)
      .setIssuedAt()
      .setExpirationTime(TOKEN_CONFIG.ADMIN.refreshExpiration)
      .sign(key);

    const { payload } = await jose.jwtVerify(jwt, key);

    return { token: jwt, expiration: payload.exp, jti: jwtid };
  } catch (error) {
    throw { statusCode: 500, message: "Admin Refresh Token Error", error };
  }
}

export async function validateJWT(jwt, key) {
  try {
    const { payload } = await jose.jwtVerify(jwt, key, {
      requiredClaims: ["iss", "aud", "sub", "exp", "iat", "jti"],
      issuer: [TOKEN_CONFIG.USER.issuer, TOKEN_CONFIG.ADMIN.issuer],
    });

    const expectedAudience =
      payload.iss === TOKEN_CONFIG.USER.issuer ? TOKEN_CONFIG.USER.audience : TOKEN_CONFIG.ADMIN.audience;

    if (payload.aud !== expectedAudience) {
      throw new Error("Invalid token audience");
    }

    return payload;
  } catch (error) {
    throw {
      statusCode: 401,
      message: "Token validation failed",
      error: error.message,
      code: "INVALID_TOKEN",
    };
  }
}
