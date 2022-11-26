import * as jose from "jose";
import { webcrypto } from "crypto";
import { randomUUID } from "crypto";
import { importKey } from "./key.js";
import Database from "better-sqlite3";
import config from "../config.js";

const { subtle } = webcrypto;

export async function makeAccesstoken(userObj) {
  try {
    const secretKey = await importKey();

    // set default expiration time of the jwt token
    let expirationTime = "1h";

    const claims = {
      userid: userObj.uuid,
      name: userObj.name,
      email: userObj.email,
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
  { recoveryToken = false } = {}
) {
  try {
    // set default expiration time of the jwt token
    let expirationTime = "7d";
    const secretKey = await importKey();
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

export async function validateJWT(jwt) {
  try {
    const secretKey = await importKey();

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return payload;
  } catch (error) {
    throw { statusCode: 500, message: "Server Error" };
  }
}
// const jwtPlugin = async function (fastify, opts, done) {
//   try {
//     fastify.decorate("makeAccessToken", makeAccestoken());
//     fastify.decorate("makeRefreshToken", makeRefreshtoken());

//   } catch (error) {
//     console.log(error);
//   }
//   done();
// };
// export default fastifyPlugin(jwtPlugin);
