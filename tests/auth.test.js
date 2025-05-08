import test from "ava";
import { buildApp } from "../app.js";
import { unlink } from "node:fs/promises";
import { parse } from "cookie";
import { eq } from "drizzle-orm";
import config from "../config.js";
import { decodeJwt } from "jose";

// Helper functions
const registerTestUser = async (app, userData) => {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: {
      data: {
        type: "users",
        attributes: userData,
      },
    },
  });
};

const loginTestUser = async (app, credentials) => {
  const res = await app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      data: {
        type: "users",
        attributes: credentials,
      },
    },
  });
  return res.json().data.attributes.access_token;
};

test.before(async (t) => {
  t.context.app = await buildApp();
});

test.after.always("cleanup", async (t) => {
  await Promise.all([unlink("./test.db"), unlink("./serverkey_test"), unlink("./adminkey_test")]);
});

// Registration Tests
test.serial("POST /auth/register - successful registration", async (t) => {
  const TEST_USER = {
    name: "Registration Test User",
    email: "register_test@authcompanion.com",
    password: "registrationPass123",
  };

  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: {
      data: {
        type: "users",
        attributes: TEST_USER,
      },
    },
  });

  t.is(res.statusCode, 201);
  t.is(res.json().data.type, "users");
  const attributes = res.json().data.attributes;
  t.is(attributes.email, TEST_USER.email);
  t.truthy(attributes.access_token);

  const cookies = parse(res.headers["set-cookie"][0]);
  t.truthy(cookies.userRefreshToken);
});

test.serial("POST /auth/register - duplicate email rejection", async (t) => {
  const TEST_USER = {
    name: "Duplicate Test User",
    email: "duplicate_test@authcompanion.com",
    password: "duplicatePass123",
  };

  await registerTestUser(t.context.app, TEST_USER);

  const duplicateRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: {
      data: {
        type: "users",
        attributes: TEST_USER,
      },
    },
  });

  t.is(duplicateRes.statusCode, 400);
});

// Login Tests
test.serial("POST /auth/login - successful login", async (t) => {
  const TEST_USER = {
    name: "Login Test User",
    email: "login_test@authcompanion.com",
    password: "loginPass123",
  };

  await registerTestUser(t.context.app, TEST_USER);

  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      data: {
        type: "users",
        attributes: {
          email: TEST_USER.email,
          password: TEST_USER.password,
        },
      },
    },
  });

  t.is(res.statusCode, 200);
  t.is(res.json().data.attributes.email, TEST_USER.email);
  t.truthy(res.json().data.attributes.access_token);
});

test.serial("POST /auth/login - invalid credentials rejection", async (t) => {
  const TEST_USER = {
    email: "invalidcreds_test@authcompanion.com",
    password: "invalidPass123",
  };

  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      data: {
        type: "users",
        attributes: {
          email: "nonexistent@test.com",
          password: "wrongPassword",
        },
      },
    },
  });

  t.is(res.statusCode, 400);
  t.is(res.json().message, "Login Failed");
});

// Profile Update Tests
test.serial("POST /auth/profile - successful update", async (t) => {
  const TEST_USER = {
    name: "Profile Test User",
    email: "profile_test@authcompanion.com",
    password: "profilePass123",
  };

  await registerTestUser(t.context.app, TEST_USER);
  const accessToken = await loginTestUser(t.context.app, TEST_USER);

  const updateRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/profile",
    headers: { authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: {
          name: "Updated Name",
          email: "updated_email@authcompanion.com",
          password: "newPassword123",
        },
      },
    },
  });

  t.is(updateRes.statusCode, 200);
  t.is(updateRes.json().data.attributes.name, "Updated Name");
});

test.serial("POST /auth/profile - email conflict rejection", async (t) => {
  const [USER1, USER2] = [
    {
      name: "Profile Test User",
      email: "user1_conflict@test.com",
      password: "conflictPass123",
    },
    {
      name: "Profile Test User",
      email: "user2_conflict@test.com",
      password: "conflictPass123",
    },
  ];

  await Promise.all([registerTestUser(t.context.app, USER1), registerTestUser(t.context.app, USER2)]);

  const accessToken = await loginTestUser(t.context.app, USER1);

  const updateRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/profile",
    headers: { authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: {
          email: USER2.email,
        },
      },
    },
  });

  t.is(updateRes.statusCode, 409);
});

test.serial("POST /auth/profile - invalid request rejection", async (t) => {
  const TEST_USER = {
    name: "Profile Test User",
    email: "invalidreq_test@authcompanion.com",
    password: "invalidReqPass123",
  };

  await registerTestUser(t.context.app, TEST_USER);
  const accessToken = await loginTestUser(t.context.app, TEST_USER);

  const updateRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/profile",
    headers: { authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "invalid_type",
        attributes: { name: "New Name" },
      },
    },
  });

  t.is(updateRes.statusCode, 400);
});

test.serial("POST /auth/profile - token regeneration", async (t) => {
  const TEST_USER = {
    name: "Profile Test User",
    email: "tokenreg_test@authcompanion.com",
    password: "tokenRegPass123",
  };

  await registerTestUser(t.context.app, TEST_USER);
  const accessToken = await loginTestUser(t.context.app, TEST_USER);

  const updateRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/profile",
    headers: { authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: { name: "Updated Name" },
      },
    },
  });

  t.not(updateRes.json().data.attributes.access_token, accessToken);
  t.truthy(updateRes.headers["set-cookie"]);
});

test.serial("POST /auth/profile - user not found handling", async (t) => {
  const TEST_USER = {
    name: "Profile Test User",
    email: "notfound_test@authcompanion.com",
    password: "notfoundPass123",
  };

  await registerTestUser(t.context.app, TEST_USER);
  const accessToken = await loginTestUser(t.context.app, TEST_USER);

  // Delete user directly
  await t.context.app.db.delete(t.context.app.users).where(eq(t.context.app.users.email, TEST_USER.email));

  const updateRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/profile",
    headers: { authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: { name: "New Name" },
      },
    },
  });

  t.is(updateRes.statusCode, 404);
});

test.serial("POST /auth/refresh - successful token refresh", async (t) => {
  const TEST_USER = {
    name: "Refresh Test User",
    email: "refresh_test@authcompanion.com",
    password: "refreshPass123",
  };

  // Register and login user
  await registerTestUser(t.context.app, TEST_USER);
  const loginRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      data: {
        type: "users",
        attributes: TEST_USER,
      },
    },
  });

  // Get initial tokens
  const originalAccessToken = loginRes.json().data.attributes.access_token;
  const cookies = parse(loginRes.headers["set-cookie"][0]);

  // Refresh tokens
  const refreshRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/refresh",
    payload: {},
    headers: {
      cookie: `userRefreshToken=${cookies.userRefreshToken}`,
    },
  });

  t.is(refreshRes.statusCode, 200);
  t.truthy(refreshRes.json().data.attributes.access_token);
  t.not(refreshRes.json().data.attributes.access_token, originalAccessToken);
  t.truthy(refreshRes.headers["set-cookie"]);
});

test.serial("POST /auth/refresh - missing cookie rejection", async (t) => {
  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/refresh",
    payload: {},
  });

  t.is(res.statusCode, 401);
  t.is(res.json().message, "Authentication required");
});

test.serial("POST /auth/refresh - invalid token rejection", async (t) => {
  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/refresh",
    payload: {},
    headers: {
      cookie: "userRefreshToken=invalid_token",
    },
  });

  t.is(res.statusCode, 401);
  t.is(res.json().message, "Token validation failed");
});

test.serial("POST /auth/refresh - revoked token rejection", async (t) => {
  const TEST_USER = {
    name: "Revoked Test User",
    email: "revoked_test@authcompanion.com",
    password: "revokedPass123",
  };

  // Register, login, and revoke
  await registerTestUser(t.context.app, TEST_USER);
  const loginRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      data: {
        type: "users",
        attributes: TEST_USER,
      },
    },
  });
  const cookies = parse(loginRes.headers["set-cookie"][0]);

  // Revoke token
  await t.context.app.inject({
    method: "DELETE",
    url: "/v1/auth/refresh",
    payload: {},
    headers: {
      cookie: `userRefreshToken=${cookies.userRefreshToken}`,
    },
  });

  // Attempt refresh with revoked token
  const refreshRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/refresh",
    payload: {},
    headers: {
      cookie: `userRefreshToken=${cookies.userRefreshToken}`,
    },
  });

  t.is(refreshRes.statusCode, 401);
});

test.serial("DELETE /auth/refresh - successful token revocation", async (t) => {
  const TEST_USER = {
    name: "Revoke Test User",
    email: "revoke_test@authcompanion.com",
    password: "revokePass123",
  };

  await registerTestUser(t.context.app, TEST_USER);
  const loginRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/login",
    payload: {
      data: {
        type: "users",
        attributes: TEST_USER,
      },
    },
  });
  const cookies = parse(loginRes.headers["set-cookie"][0]);

  // Revoke token
  const deleteRes = await t.context.app.inject({
    method: "DELETE",
    url: "/v1/auth/refresh",
    payload: {},
    headers: {
      cookie: `userRefreshToken=${cookies.userRefreshToken}`,
    },
  });

  t.is(deleteRes.statusCode, 200);

  // Verify database state
  const [user] = await t.context.app.db
    .select()
    .from(t.context.app.users)
    .where(eq(t.context.app.users.email, TEST_USER.email));

  t.is(user.jwt_id, null);
});

test.serial("DELETE /auth/refresh - invalid token revocation", async (t) => {
  const deleteRes = await t.context.app.inject({
    method: "DELETE",
    url: "/v1/auth/refresh",
    payload: {},
    headers: {
      cookie: "userRefreshToken=invalid_token",
    },
  });

  t.is(deleteRes.statusCode, 401);
});
// Add to existing test file
test.serial("POST /auth/recovery - initiates password reset for valid email", async (t) => {
  const TEST_USER = {
    name: "Recovery Test User",
    email: "recovery_test@authcompanion.com",
    password: "recoveryPass123",
  };

  await registerTestUser(t.context.app, TEST_USER);

  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/recovery",
    payload: {
      data: {
        type: "users",
        attributes: { email: TEST_USER.email },
      },
    },
  });

  t.is(res.statusCode, 200);
  t.is(res.json().data.detail, "Recovery email sent");

  // Verify recovery token was stored
  const [user] = await t.context.app.db
    .select({ jwt_id: t.context.app.users.jwt_id })
    .from(t.context.app.users)
    .where(eq(t.context.app.users.email, TEST_USER.email));

  t.truthy(user.jwt_id, "JWT ID should be set for recovery");
});

test.serial("POST /auth/recovery - handles non-existent email gracefully", async (t) => {
  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/recovery",
    payload: {
      data: {
        type: "users",
        attributes: { email: "nonexistent@test.com" },
      },
    },
  });

  t.is(res.statusCode, 200);
  t.is(res.json().data.detail, "Recovery email sent");
});

// test.serial("POST /auth/recovery - generates valid recovery token", async (t) => {
//   const TEST_USER = {
//     name: "tokentestuser",
//     email: "validtoken_test@authcompanion.com",
//     password: "validTokenPass123",
//   };

//   await registerTestUser(t.context.app, TEST_USER);
//   await t.context.app.inject({
//     method: "POST",
//     url: "/v1/auth/recovery",
//     payload: {
//       data: {
//         type: "users",
//         attributes: { email: TEST_USER.email },
//       },
//     },
//   });

//   // Get generated token
//   const [user] = await t.context.app.db
//     .select({ jwt_id: t.context.app.users.jwt_id })
//     .from(t.context.app.users)
//     .where(eq(t.context.app.users.email, TEST_USER.email));

//   // Verify token structure
//   const decoded = decodeJwt(user.jwt_id);
//   t.truthy(decoded, "Token should be valid JWT");
//   t.is(decoded.email, TEST_USER.email, "Token should contain user email");
//   t.true(decoded.recoveryToken, "Token should have recovery claim");
// });

test.serial("POST /auth/recovery - invalidates previous tokens on new request", async (t) => {
  const TEST_USER = {
    name: "tokentestuser",
    email: "tokeninvalidation_test@authcompanion.com",
    password: "tokenInvalidationPass123",
  };

  await registerTestUser(t.context.app, TEST_USER);

  // First recovery request
  await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/recovery",
    payload: {
      data: {
        type: "users",
        attributes: { email: TEST_USER.email },
      },
    },
  });

  const [firstUser] = await t.context.app.db
    .select({ jwt_id: t.context.app.users.jwt_id })
    .from(t.context.app.users)
    .where(eq(t.context.app.users.email, TEST_USER.email));

  // Second recovery request
  await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/recovery",
    payload: {
      data: {
        type: "users",
        attributes: { email: TEST_USER.email },
      },
    },
  });

  const [secondUser] = await t.context.app.db
    .select({ jwt_id: t.context.app.users.jwt_id })
    .from(t.context.app.users)
    .where(eq(t.context.app.users.email, TEST_USER.email));

  t.not(firstUser.jwt_id, secondUser.jwt_id, "Should generate new token on subsequent requests");
});

test.serial("POST /auth/recovery - handles SMTP failures gracefully", async (t) => {
  const TEST_USER = {
    email: "smtpfailure_test@authcompanion.com",
    password: "smtpFailurePass123",
  };

  await registerTestUser(t.context.app, TEST_USER);

  // Force invalid SMTP configuration
  const originalConfig = { ...config };
  config.SMTPHOSTNAME = "invalid.host";

  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/recovery",
    payload: {
      data: {
        type: "users",
        attributes: { email: TEST_USER.email },
      },
    },
  });

  // Restore config
  Object.assign(config, originalConfig);

  t.is(res.statusCode, 200);
  t.is(res.json().data.detail, "Recovery email sent");
});
