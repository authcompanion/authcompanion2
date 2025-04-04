import { makeAccesstoken, makeRefreshtoken, validateJWT } from "../../utils/jwt.js";
import config from "../../config.js";
import { parse } from "cookie";
import { refreshCookie, fgpCookie } from "../../utils/cookies.js";
import { users } from "../../db/sqlite/sqlite.schema.js";
import { eq } from "drizzle-orm";

const getRefreshToken = (request) => {
  const { userRefreshToken } = parse(request.headers.cookie || "");
  if (!userRefreshToken) {
    request.log.info("Missing refresh token");
    throw { statusCode: 401, message: "Authentication required" };
  }
  return userRefreshToken;
};

const validateUser = async function (jti, db) {
  const [user] = await db
    .select({
      uuid: users.uuid,
      name: users.name,
      email: users.email,
      jwt_id: users.jwt_id,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.jwt_id, jti));

  if (!user) throw { statusCode: 401, message: "Invalid token" };
  return user;
};

export const tokenRefreshHandler = async function (request, reply) {
  const refreshToken = getRefreshToken(request);
  const { jti } = await validateJWT(refreshToken, this.key);
  const user = await validateUser(jti, this.db);

  const accessToken = await makeAccesstoken(user, this.key);
  const newRefreshToken = await makeRefreshtoken(user, this.key, this);

  reply.headers({
    "set-cookie": [refreshCookie(newRefreshToken.token), fgpCookie(accessToken.userFingerprint)],
    "x-authc-app-origin": config.APPLICATIONORIGIN,
  });

  return {
    data: {
      type: "users",
      id: user.uuid,
      attributes: {
        name: user.name,
        email: user.email,
        created: user.created_at,
        access_token: accessToken.token,
        access_token_expiry: accessToken.expiration,
      },
    },
  };
};

export const tokenRefreshDeleteHandler = async function (request) {
  const refreshToken = getRefreshToken(request);
  const { jti } = await validateJWT(refreshToken, this.key);

  const [result] = await this.db
    .update(users)
    .set({ jwt_id: null })
    .where(eq(users.jwt_id, jti))
    .returning({ uuid: users.uuid });

  if (!result) {
    throw { statusCode: 500, message: "Token revocation failed" };
  }
};
