import test from "ava";
import buildApp from "../app.js";
import { unlink } from "node:fs/promises";
import { parse } from "cookie";
import { readFile } from "node:fs/promises";
import {
  makeAccesstoken,
  makeRefreshtoken,
  makeAdminToken,
} from "../utils/jwt.js";
import * as jose from "jose";

// Setup Test
test.before(async (t) => {
  //build app with the test database
  t.context.app = await buildApp();

  //set up admin password
  const adminKey = await readFile("./adminkey_test", "utf8");
  const adminPassword = adminKey.split("admin password:")[1].trim();
  t.context.adminPass = adminPassword;

  //create a user to test auth api endpoints with
  const response = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: {
      data: {
        type: "users",
        attributes: {
          name: "Authy Person",
          email: "hello_test@authcompanion.com",
          password: "mysecretpass",
        },
      },
    },
  });

  const response3 = await t.context.app.inject({
    method: "POST",
    url: "/v1/auth/register",
    payload: {
      data: {
        type: "users",
        attributes: {
          name: "Authy Person",
          email: "hello_test@authcompanion.com",
          password: "mysecretpass",
          metadata: {
            tenant: "tenantID",
          },
        },
      },
    },
  });

  //save user details to context
  const data = await response.json();
  t.context.uuid = data.data.id;
  t.context.jwt = data.data.attributes.access_token;
  t.context.refreshToken = parse(response.headers["set-cookie"][0])[
    "userRefreshToken"
  ];
  t.context.fgp = parse(response.headers["set-cookie"][1])["fgp"];

  //create a user to test admin api endpoints with
  const response2 = await t.context.app.inject({
    method: "POST",
    url: "/v1/admin/login",
    payload: {
      data: {
        type: "users",
        attributes: {
          email: "admin@localhost",
          password: t.context.adminPass,
        },
      },
    },
  });

  //save admin jwt to context
  t.context.adminJWT = response2.json().data.attributes.access_token;
  t.context.adminRefresh = response2.json().data.attributes.refresh_token;
  // t.context.adminFgp = parse(response.headers["set-cookie"][1])["fgp"];
});

// Cleanup Test
test.after.always("cleanup tests", async (t) => {
  await unlink("./test.db");
  await unlink("./test.db-shm");
  await unlink("./test.db-wal");
  //remove the serverkey
  await unlink("./serverkey_test");

  //remove adminkey
  await unlink("./adminkey_test");

  console.log("Cleaning up tests - successfully deleted test db");
});

// Start Tests

test.serial.todo("API Endpoint Test: /auth/recovery");

test.serial("Auth Endpoint Test: GET /auth/refresh", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      payload: {},
      headers: {
        Cookie: `userRefreshToken=${t.context.refreshToken}`,
      },
      body: JSON.stringify({}),
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Auth Endpoint Test: POST /auth/register", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        data: {
          type: "users",
          attributes: {
            name: "Authy Person",
            email: "hello_test_register@authcompanion.com",
            password: "mysecretpass",
            metadata: {
              tenant: "12345",
            },
          },
        },
      },
    });
    t.is(response.statusCode, 201, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Auth Endpoint Test: POST /auth/login", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        data: {
          type: "users",
          attributes: {
            name: "Authy Person",
            email: "hello_test@authcompanion.com",
            password: "mysecretpass",
          },
        },
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Auth Endpoint Test: POST /auth/users/me", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/users/me",
      payload: {
        data: {
          type: "users",
          attributes: {
            name: "Authy Person_update",
            email: "hello_updated@authcompanion.com",
            password: "mysecretpass1",
            metadata: {
              secret: "notreally",
            },
          },
        },
      },
      headers: {
        Authorization: `Bearer ${t.context.jwt}`,
        cookie: `${t.context.fgp}`,
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Admin Endpoint Test: POST /admin/refesh", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/admin/refresh",
      payload: {
        refreshToken: t.context.adminRefresh,
      },
      headers: {},
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Admin Endpoint Test: POST /admin/login", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: `/v1/admin/login`,
      payload: {
        data: {
          type: "users",
          attributes: {
            email: "admin@localhost",
            password: t.context.adminPass,
          },
        },
      },
    });

    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Admin Endpoint Test: GET /admin/users", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "GET",
      url: "/v1/admin/users",
      headers: {
        Authorization: `Bearer ${t.context.adminJWT}`,
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Admin Endpoint Test: POST /admin/users", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/admin/users",
      payload: {
        data: {
          type: "users",
          attributes: {
            name: "Test User",
            email: "mytestuser1@authcompanion.com",
            password: "supersecret",
            active: 1,
          },
        },
      },
      headers: {
        Authorization: `Bearer ${t.context.adminJWT}`,
      },
    });
    t.is(response.statusCode, 201, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Admin Endpoint Test: PATCH /admin/users/:uuid", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "PATCH",
      url: `/v1/admin/users/${t.context.uuid}`,
      payload: {
        data: {
          type: "users",
          id: `${t.context.uuid}`,
          attributes: {
            name: "Test User",
            email: "email@email.com",
            active: 0,
          },
        },
      },
      headers: {
        Authorization: `Bearer ${t.context.adminJWT}`,
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Admin Endpoint Test: DELETE /admin/users/:uuid", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "DELETE",
      url: `/v1/admin/users/${t.context.uuid}`,
      headers: {
        Authorization: `Bearer ${t.context.adminJWT}`,
      },
    });
    t.is(response.statusCode, 204, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test("JWT Test: makeAccesstoken generates a valid JWT token", async (t) => {
  const userObj = {
    uuid: "123",
    name: "John Doe",
    email: "johndoe@example.com",
    metadata: JSON.stringify({
      tenant: "1234",
    }),
  };
  const secretKey = t.context.app.key;

  const { token, expiration, userFingerprint } = await makeAccesstoken(
    userObj,
    secretKey,
  );

  // Fetch the payload
  const { payload } = await jose.jwtVerify(token, secretKey);

  // Verify the user information in the JWT payload
  t.is(payload.userid, userObj.uuid);
  t.is(payload.name, userObj.name);
  t.is(payload.email, userObj.email);
  t.deepEqual(payload.metadata, JSON.parse(userObj.metadata));

  // Assert that the token is not empty
  t.truthy(token);

  // Assert that the userFingerprint is not empty
  t.truthy(userFingerprint);

  // Assert that the expiration is not empty
  t.truthy(expiration);
});

test("JWT Test: makeRefreshtoken generates a valid refresh JWT token", async (t) => {
  const userObj = {
    uuid: "123",
    name: "John Doe",
    email: "johndoe@example.com",
  };
  const secretKey = t.context.app.key;

  // Generate a refresh token using the function
  const { token, expiration } = await makeRefreshtoken(userObj, secretKey);

  // Fetch the payload
  const { payload } = await jose.jwtVerify(token, secretKey);

  // Verify the user information in the JWT payload
  t.is(payload.userid, userObj.uuid);
  t.is(payload.name, userObj.name);
  t.is(payload.email, userObj.email);

  // Assert that the token is not empty
  t.truthy(token);

  // Assert that the expiration is not empty
  t.truthy(expiration);
});

test("JWT Test: makeRefreshtoken generates a valid recovery JWT token", async (t) => {
  const userObj = {
    uuid: "123",
    name: "John Doe",
    email: "johndoe@example.com",
  };
  const secretKey = t.context.app.key;

  // Generate a recovery token using the function
  const { token, expiration } = await makeRefreshtoken(userObj, secretKey, {
    recoveryToken: true,
  });

  // Fetch the payload
  const { payload } = await jose.jwtVerify(token, secretKey);

  // Verify the user information in the JWT payload
  t.is(payload.userid, userObj.uuid);
  t.is(payload.name, userObj.name);
  t.is(payload.email, userObj.email);

  // Assert that the token is not empty
  t.truthy(token);

  // Assert that the expiration is not empty
  t.truthy(expiration);
});

test("JWT Test: makeAdminToken generates a valid admin JWT token", async (t) => {
  const userObj = {
    uuid: "123",
    name: "Admin User",
    email: "admin@example.com",
  };
  const secretKey = t.context.app.key;

  // Generate an admin token using the function
  const { token, expiration, userFingerprint } = await makeAdminToken(
    userObj,
    secretKey,
  );

  // Fetch the payload
  const { payload } = await jose.jwtVerify(token, secretKey);

  // Verify the user information in the JWT payload
  t.is(payload.userid, userObj.uuid);
  t.is(payload.name, userObj.name);
  t.is(payload.email, userObj.email);

  // Verify the scope in the JWT payload
  t.is(payload.scope, "admin");

  // Verify the userFingerprint in the JWT payload
  // t.truthy(payload.userFingerprint);
  // t.is(payload.userFingerprint, userFingerprint);

  // Assert that the token is not empty
  t.truthy(token);

  // Assert that the expiration is not empty
  t.truthy(expiration);
});
