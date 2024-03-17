import * as jose from "jose";
import { randomUUID } from "crypto";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { users } from "../db/sqlite/schema.js";
import { eq } from "drizzle-orm";
import config from "../config.js";
import { createHash, verifyValueWithHash } from "./credential.js";
import crypto from "crypto";

// Generate a random string & hash that will constitute the fingerprint for this user
async function generateClientContext() {
  //generate a random string of length 16
  const fingerprint = crypto.randomBytes(16).toString("hex");
  //has the random string
  const hash = await createHash(fingerprint);
  return { userFingerprint: fingerprint, userFingerprintHash: hash };
}

// Creates a JWT token used for user authentication, with scope as "user"
export async function makeAccesstoken(userAcc, secretKey) {
  try {
    // set default expiration time of the access jwt token
    let expirationTime = "1h";

    //generate the client context for storing the hash in the jwt claims
    const { userFingerprint, userFingerprintHash } = await generateClientContext();

    // build the token claims
    const claims = {
      userid: userAcc.uuid,
      name: userAcc.name,
      email: userAcc.email,
      userFingerprint: userFingerprintHash,
      scope: "user",
    };

    if (userAcc.metadata !== undefined && userAcc.metadata !== null && userAcc.metadata !== "{}") {
      claims.metadata = JSON.parse(userAcc.metadata);
    }

    if (userAcc.appdata !== undefined && userAcc.appdata !== null && userAcc.appdata !== "{}") {
      claims.app = JSON.parse(userAcc.appdata);
    }

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secretKey);

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return {
      token: jwt,
      expiration: payload.exp,
      userFingerprint: userFingerprint,
    };
  } catch (error) {
    fastify.log.info(error);
    throw { statusCode: 500, message: "Server Error" };
  }
}

//https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps-05#section-8
export async function makeRefreshtoken(userAcc, secretKey, { recoveryToken = false } = {}) {
  try {
    // set default expiration time of the jwt token
    let expirationTime = "7d";

    // If a "recovery token" is requested for account recovery route, return token with shorter expiration time
    if (recoveryToken) {
      expirationTime = "15m";
    }
    const claims = {
      userid: userAcc.uuid,
      name: userAcc.name,
      email: userAcc.email,
    };

    if (userAcc.metadata !== undefined && userAcc.metadata !== null && userAcc.metadata !== "{}") {
      claims.metadata = JSON.parse(userAcc.metadata);
    }

    if (userAcc.appdata !== undefined && userAcc.appdata !== null && userAcc.appdata !== "{}") {
      claims.app = JSON.parse(userAcc.appdata);
    }

    const sqlite = new Database(`${config.DBPATH}`);
    const db = drizzle(sqlite);

    // Generate a random UUID for the token
    const jwtid = randomUUID();

    // Update the admin table with the new JWT ID
    await db.update(users).set({ jwt_id: jwtid }).where(eq(users.uuid, userAcc.uuid));

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .setJti(jwtid)
      .sign(secretKey);

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return { token: jwt, expiration: payload.exp };
  } catch (error) {
    fastify.log.info(error);
    throw { statusCode: 500, message: "Server Error" };
  }
}

// Creates a JWT token used for Admin dashboard authentication, with scope as "admin"
export async function makeAdminToken(adminUserAcc, secretKey) {
  try {
    // set default expiration time of the jwt token
    let expirationTime = "1h";

    //generate the client context for storing the hash in the jwt claims
    const { userFingerprint, userFingerprintHash } = await generateClientContext();

    const claims = {
      userid: adminUserAcc.uuid,
      name: adminUserAcc.name,
      email: adminUserAcc.email,
      userFingerprint: userFingerprintHash,
      scope: "admin",
    };

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secretKey);

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return {
      token: jwt,
      expiration: payload.exp,
      userFingerprint: userFingerprint,
    };
  } catch (error) {
    fastify.log.info(error);
    throw { statusCode: 500, message: "Server Error" };
  }
}

export async function makeAdminRefreshtoken(adminUserAcc, secretKey) {
  try {
    // Set default expiration time of the JWT token
    let expirationTime = "7d";

    // Define the token claims for the admin refresh token
    const claims = {
      userid: adminUserAcc.uuid,
      name: adminUserAcc.name,
      email: adminUserAcc.email,
      userFingerprint: null,
      scope: "admin",
    };

    const sqlite = new Database(`${config.DBPATH}`);
    const db = drizzle(sqlite);

    // Generate a random UUID for the token
    const jwtid = randomUUID();

    // Update the admin table with the new JWT ID
    await db.update(users).set({ jwt_id: jwtid }).where(eq(users.uuid, adminUserAcc.uuid));

    // Create and sign the JWT token
    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .setJti(jwtid)
      .sign(secretKey);

    // Verify the token and retrieve its payload
    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return { token: jwt, expiration: payload.exp };
  } catch (error) {
    console.log(error);
    throw { statusCode: 500, message: "Server Error" };
  }
}

// Validates a JWT token
export async function validateJWT(jwt, secretKey, fingerprint = null) {
  try {
    const { payload } = await jose.jwtVerify(jwt, secretKey, {
      requiredClaims: fingerprint === null ? [] : ["userFingerprint"],
    });

    if (!fingerprint) {
      return payload;
    }

    const validUserContext = await verifyValueWithHash(fingerprint, payload.userFingerprint);

    if (!validUserContext) {
      throw { statusCode: 500, message: "Server Error" };
    }

    return payload;
  } catch (error) {
    fastify.log.info(error);
    throw { statusCode: 500, message: "Server Error" };
  }
}
