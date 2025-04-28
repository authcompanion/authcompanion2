import test from "ava";
import { buildApp } from "../app.js";
import { readFile, unlink } from "node:fs/promises";
import { parse } from "cookie";
import config from "../config.js";
import { createHash } from "../utils/credential.js";
import { eq, ne } from "drizzle-orm";

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
  return res;
};

async function loginAsAdmin(t) {
  const loginRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/admin/login",
    payload: {
      data: {
        type: "users",
        attributes: t.context.adminCredentials,
      },
    },
  });
  return loginRes.json().data.attributes.access_token;
}

test.before(async (t) => {
  t.context.app = await buildApp();
  const adminKeyContent = await readFile("./adminkey_test", "utf-8");
  const lines = adminKeyContent.split("\n");
  const email = lines[0].split(":")[1].trim();
  const password = lines[1].split(":")[1].trim();
  t.context.adminCredentials = { email, password };
});

test.after.always("cleanup", async (t) => {
  await Promise.all([unlink("./test.db"), unlink("./serverkey_test"), unlink("./adminkey_test")]);
});

test.serial("GET /admin/users - default pagination", async (t) => {
  const accessToken = await loginAsAdmin(t);

  // Create test users
  for (let i = 0; i < 12; i++) {
    await registerTestUser(t.context.app, {
      email: `user${i}@test.com`,
      password: `password${i}`,
      name: `User ${i}`,
    });
  }

  const res = await t.context.app.inject({
    method: "GET",
    url: "/v1/admin/users",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  t.is(res.statusCode, 200);
  const json = res.json();
  t.is(json.data.length, 10);
  t.is(json.meta.pagination.current, 1);
  t.is(json.meta.pagination.size, 10);
  t.truthy(json.links.next);
});

test.serial("GET /admin/users - custom pagination", async (t) => {
  const accessToken = await loginAsAdmin(t);

  // Create test users
  for (let i = 0; i < 15; i++) {
    await registerTestUser(t.context.app, {
      email: `user${i}@test.com`,
      password: `password${i}`,
      name: `User ${i}`,
    });
  }

  const res = await t.context.app.inject({
    method: "GET",
    url: "/v1/admin/users?page[number]=2&page[size]=5",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  t.is(res.statusCode, 200);
  const json = res.json();
  t.is(json.data.length, 5);
  t.is(json.meta.pagination.current, 2);
  t.truthy(json.links.prev);
});

test.serial("GET /admin/users - email search", async (t) => {
  const accessToken = await loginAsAdmin(t);

  await registerTestUser(t.context.app, {
    email: "find.me@example.com",
    password: "password",
    name: "Target User",
  });
  await registerTestUser(t.context.app, {
    email: "ignore.me@test.com",
    password: "password",
    name: "Other User",
  });

  const res = await t.context.app.inject({
    method: "GET",
    url: "/v1/admin/users?search[email]=example.com",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  t.is(res.statusCode, 200);
  const json = res.json();
  t.is(json.data.length, 1);
  t.is(json.data[0].attributes.email, "find.me@example.com");
});

test.serial("GET /admin/users - unauthorized access", async (t) => {
  const res = await t.context.app.inject({
    method: "GET",
    url: "/v1/admin/users",
  });
  t.is(res.statusCode, 401);
});

test.serial("DELETE /admin/users/:uuid - delete user", async (t) => {
  const accessToken = await loginAsAdmin(t);

  // Create test user
  const regRes = await registerTestUser(t.context.app, {
    email: "delete.me@example.com",
    password: "password123",
    name: "Delete Target",
  });
  const userUuid = regRes.json().data.id;

  // Delete user
  const deleteRes = await t.context.app.inject({
    method: "DELETE",
    url: `/v1/admin/users/${userUuid}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  t.is(deleteRes.statusCode, 204);

  // Verify in database
  const [deletedUser] = await t.context.app.db
    .select()
    .from(t.context.app.users)
    .where(eq(t.context.app.users.uuid, userUuid));
  t.falsy(deletedUser);
});

test.serial("DELETE /admin/users/:uuid - non-existent user", async (t) => {
  const accessToken = await loginAsAdmin(t);
  const fakeUuid = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID v4 format

  const res = await t.context.app.inject({
    method: "DELETE",
    url: `/v1/admin/users/${fakeUuid}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  t.is(res.statusCode, 404);
  t.is(res.json().message, "User not found");
});
test.serial("PATCH /admin/users/:uuid - basic update", async (t) => {
  const accessToken = await loginAsAdmin(t);

  // Create test user
  const regRes = await registerTestUser(t.context.app, {
    email: "update.test@example.com",
    password: "password",
    name: "Original Name",
  });
  const userUuid = regRes.json().data.id;

  // Update user
  const updateRes = await t.context.app.inject({
    method: "PATCH",
    url: `/v1/admin/users/${userUuid}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: {
          name: "Updated Name",
          metadata: { newKey: "value" },
        },
      },
    },
  });

  t.is(updateRes.statusCode, 200);
  const json = updateRes.json();
  t.is(json.data.attributes.name, "Updated Name");
  t.deepEqual(json.data.attributes.metadata, { newKey: "value" });
});

test.serial("PATCH /admin/users/:uuid - update email", async (t) => {
  const accessToken = await loginAsAdmin(t);
  const regRes = await registerTestUser(t.context.app, {
    email: "original@example.com",
    password: "password",
    name: "Test User",
  });
  const userUuid = regRes.json().data.id;

  const updateRes = await t.context.app.inject({
    method: "PATCH",
    url: `/v1/admin/users/${userUuid}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: {
          email: "updated@example.com",
        },
      },
    },
  });

  t.is(updateRes.statusCode, 200);
  t.is(updateRes.json().data.attributes.email, "updated@example.com");
});

test.serial("PATCH /admin/users/:uuid - duplicate email", async (t) => {
  const accessToken = await loginAsAdmin(t);

  // Create two users
  await registerTestUser(t.context.app, { name: "testman", email: "user1@test.com", password: "passtest33212" });
  const regRes = await registerTestUser(t.context.app, {
    name: "testman",
    email: "user22@test.com",
    password: "passtest33212",
  });
  const userUuid = regRes.json().data.id;

  // Try to update to existing email
  const res = await t.context.app.inject({
    method: "PATCH",
    url: `/v1/admin/users/${userUuid}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: {
          email: "user1@test.com",
        },
      },
    },
  });

  t.is(res.statusCode, 409);
  t.is(res.json().message, "Email already in use");
});

test.serial("PATCH /admin/users/:uuid - not found", async (t) => {
  const accessToken = await loginAsAdmin(t);
  const fakeUuid = "550e8400-e29b-41d4-a716-446655440000";

  const res = await t.context.app.inject({
    method: "PATCH",
    url: `/v1/admin/users/${fakeUuid}`,
    headers: { Authorization: `Bearer ${accessToken}` },
    payload: {
      data: {
        type: "users",
        attributes: {
          name: "New Name",
        },
      },
    },
  });

  t.is(res.statusCode, 404);
});

test.serial("PATCH /admin/users/:uuid - unauthorized", async (t) => {
  const regRes = await registerTestUser(t.context.app, {
    name: "hellotester",
    email: "unauth.test@example.com",
    password: "password",
  });
  const userUuid = regRes.json().data.id;

  const res = await t.context.app.inject({
    method: "PATCH",
    url: `/v1/admin/users/${userUuid}`,
    payload: {
      data: {
        type: "users",
        attributes: {
          name: "Should Fail",
        },
      },
    },
  });

  t.is(res.statusCode, 401);
});
test.serial("DELETE /admin/logout/:uuid - admin logout user", async (t) => {
  const adminToken = await loginAsAdmin(t);

  // Create test user
  const regRes = await registerTestUser(t.context.app, {
    email: "logout.target55@example.com",
    password: "password123",
    name: "Logout Target",
  });
  const userUuid = regRes.json().data.id;

  // Admin logs out user
  const logoutRes = await t.context.app.inject({
    method: "DELETE",
    url: `/v1/admin/logout/${userUuid}`,
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  // Verify response
  t.is(logoutRes.statusCode, 204);

  // Verify user's JWT ID was cleared
  const [user] = await t.context.app.db
    .select({ jwt_id: t.context.app.users.jwt_id })
    .from(t.context.app.users)
    .where(eq(t.context.app.users.uuid, userUuid));

  t.is(user.jwt_id, null);

  // Verify security headers
  t.is(logoutRes.headers["x-authc-app-origin"], config.APPLICATIONORIGIN);
  t.truthy(logoutRes.headers["clear-site-data"].includes('"cookies", "storage"'));
});
test.serial("POST /admin/users - create user successfully", async (t) => {
  const adminToken = await loginAsAdmin(t);

  const userData = {
    email: "new.user@example.com",
    password: "securePassword123",
    name: "Test User",
    metadata: { department: "IT" },
    appdata: { role: "developer" },
    active: false,
  };

  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/admin/users",
    headers: { Authorization: `Bearer ${adminToken}` },
    payload: {
      data: {
        type: "users",
        attributes: userData,
      },
    },
  });
  t.is(res.statusCode, 201);
  const json = res.json();
  t.is(json.data.type, "users");
  t.is(json.data.attributes.email, userData.email);
  t.is(json.data.attributes.name, userData.name);
  t.deepEqual(json.data.attributes.metadata, userData.metadata);
  t.deepEqual(json.data.attributes.appdata, userData.appdata);
  t.is(json.data.attributes.active, false);
  t.is(json.data.attributes.isAdmin, false);

  // Verify password hashing
  const [user] = await t.context.app.db
    .select()
    .from(t.context.app.users)
    .where(eq(t.context.app.users.email, userData.email));
  t.not(user.password, userData.password);
  t.truthy(await createHash(userData.password, user.password.split(":")[1]));
});
test.serial("POST /admin/login - successful admin login", async (t) => {
  const res = await t.context.app.inject({
    method: "POST",
    url: "/v1/admin/login",
    payload: {
      data: {
        type: "users",
        attributes: t.context.adminCredentials,
      },
    },
  });

  t.is(res.statusCode, 200);
  const json = res.json();
  t.is(json.data.type, "users");
  t.is(json.data.attributes.email, t.context.adminCredentials.email);
  t.truthy(json.data.attributes.access_token);
  t.truthy(json.data.attributes.access_token_expiry);

  // Verify cookies
  const cookies = parse(res.headers["set-cookie"][0]);
  t.truthy(cookies.adminRefreshToken);
  t.is(cookies.Path, "/");
  t.is(cookies.SameSite, config.SAMESITE);

  // Verify security headers
  t.is(res.headers["x-authc-app-origin"], config.ADMINORIGIN);
});
test.serial("POST /token/refresh - successful token refresh", async (t) => {
  // Login to get initial refresh token
  const loginRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/admin/login",
    payload: {
      data: {
        type: "users",
        attributes: t.context.adminCredentials,
      },
    },
  });
  const refreshToken = parse(loginRes.headers["set-cookie"][0]).adminRefreshToken;
  // Refresh tokens
  const refreshRes = await t.context.app.inject({
    method: "POST",
    url: "/v1/admin/token/refresh",
    payload: { refreshToken: refreshToken },
  });

  t.is(refreshRes.statusCode, 200);
  t.truthy(refreshRes.json().data.attributes.access_token_expiry);

  // Verify new cookies
  const newCookie = parse(refreshRes.headers["set-cookie"][0]);
  t.truthy(newCookie.adminRefreshToken);
  t.not(newCookie.adminRefreshToken, refreshToken);
});
