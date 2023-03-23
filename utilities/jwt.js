import * as jose from "jose";
import { randomUUID } from "crypto";
import Database from "better-sqlite3";
import config from "../config.js";

// Creates a JWT token used for user authentication, with scope as "user"
export async function makeAccesstoken(userObj, secretKey) {
  try {
    // set default expiration time of the jwt token
    let expirationTime = "1h";

    const claims = {
      userid: userObj.uuid,
      name: userObj.name,
      email: userObj.email,
      scope: "user",
    };

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secretKey);

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return { token: jwt, expiration: payload.exp };
  } catch (error) {
    throw { statusCode: 500, message: "Server Error" };
  }
}

//https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps-05#section-8
export async function makeRefreshtoken(
  userObj,
  secretKey,
  { recoveryToken = false } = {}
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

    const db = new Database(config.DBPATH);

    const jwtid = randomUUID();

    const stmt = db.prepare(
      "UPDATE users SET jwt_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE uuid = ?;"
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
    let expirationTime = "2h";

    const claims = {
      userid: userObj.uuid,
      name: userObj.name,
      email: userObj.email,
      scope: "admin",
    };

    const jwt = await new jose.SignJWT(claims)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secretKey);

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return { token: jwt, expiration: payload.exp };
  } catch (error) {
    throw { statusCode: 500, message: "Server Error" };
  }
}

// Validates a JWT token
export async function validateJWT(jwt, secretKey) {
  try {
    const { payload } = await jose.jwtVerify(jwt, secretKey);
    return payload;
  } catch (error) {
    throw { statusCode: 500, message: "Server Error" };
  }
}
