import * as jose from "jose";
import { randomUUID } from "crypto";
import Database from "better-sqlite3";
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
export async function makeAccesstoken(userObj, secretKey) {
  try {
    // set default expiration time of the access jwt token
    let expirationTime = "1h";

    //generate the client context for storing the hash in the jwt claims
    const { userFingerprint, userFingerprintHash } =
      await generateClientContext();

    // build the token claims
    const claims = {
      userid: userObj.uuid,
      name: userObj.name,
      email: userObj.email,
      userFingerprint: userFingerprintHash,
      scope: "user",
    };

    if (
      userObj.metadata !== undefined &&
      userObj.metadata !== null &&
      userObj.metadata !== "{}"
    ) {
      claims.metadata = JSON.parse(userObj.metadata);
    }

    if (
      userObj.appdata !== undefined &&
      userObj.appdata !== null &&
      userObj.appdata !== "{}"
    ) {
      claims.app = JSON.parse(userObj.appdata);
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
    throw { statusCode: 500, message: "Server Error" };
  }
}

//https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps-05#section-8
export async function makeRefreshtoken(
  userObj,
  secretKey,
  { recoveryToken = false } = {},
) {
  try {
    // set default expiration time of the jwt token
    let expirationTime = "7d";

    // If a "recovery token" is requested for account recovery route, return token with shorter expiration time
    if (recoveryToken) {
      expirationTime = "15m";
    }
    const claims = {
      userid: userObj.uuid,
      name: userObj.name,
      email: userObj.email,
    };

    if (
      userObj.metadata !== undefined &&
      userObj.metadata !== null &&
      userObj.metadata !== "{}"
    ) {
      claims.metadata = JSON.parse(userObj.metadata);
    }

    if (
      userObj.appdata !== undefined &&
      userObj.appdata !== null &&
      userObj.appdata !== "{}"
    ) {
      claims.app = JSON.parse(userObj.appdata);
    }

    const db = new Database(config.DBPATH);

    const jwtid = randomUUID();

    const stmt = db.prepare(
      "UPDATE users SET jwt_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ?;",
    );
    stmt.run(jwtid, userObj.uuid);

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .setJti(jwtid)
      .sign(secretKey);

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return { token: jwt, expiration: payload.exp };
  } catch (error) {
    throw { statusCode: 500, message: "Server Error" };
  }
}

// Creates a JWT token used for Admin dashboard authentication, with scope as "admin"
export async function makeAdminToken(userObj, secretKey) {
  try {
    // set default expiration time of the jwt token
    let expirationTime = "1h";

    //generate the client context for storing the hash in the jwt claims
    const { userFingerprint, userFingerprintHash } =
      await generateClientContext();

    const claims = {
      userid: userObj.uuid,
      name: userObj.name,
      email: userObj.email,
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
    throw { statusCode: 500, message: "Server Error" };
  }
}

export async function makeAdminRefreshtoken(adminObj, secretKey) {
  try {
    // Set default expiration time of the JWT token
    let expirationTime = "7d";

    // Define the token claims for the admin refresh token
    const claims = {
      userid: adminObj.uuid,
      name: adminObj.name,
      email: adminObj.email,
      userFingerprint: null,
      scope: "admin",
    };

    // Check if adminObj has metadata and appdata properties and add them to claims as needed

    const db = new Database(config.DBPATH);

    // Generate a random UUID for the token
    const jwtid = randomUUID();

    // Update the admin table with the new JWT ID and update timestamp
    const stmt = db.prepare(
      "UPDATE admin SET jwt_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ?;",
    );
    stmt.run(jwtid, adminObj.uuid);

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

    const validUserContext = await verifyValueWithHash(
      fingerprint,
      payload.userFingerprint,
    );

    if (!validUserContext) {
      throw { statusCode: 500, message: "Server Error" };
    }

    return payload;
  } catch (error) {
    throw { statusCode: 500, message: "Server Error" };
  }
}
