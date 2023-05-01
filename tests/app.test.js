import buildApp from "../app.js";
import test from "ava";
import { unlink } from "node:fs/promises";
import { parse } from "cookie";
import { readFile } from "node:fs/promises";

// There are two main ways you can use to test your application,
// one is to test with a running server, which means that inside
// each test you will invoke `.listen()`, or with http injection.
// Http injection allows you to call routes of your server without
// the need to have a running http server underneath.
// Http injection is a first class citizen in Fastify, and you can
// use it both in production and testing.
//
// You can read more about testing and http injection at the following url:
// https://www.fastify.io/docs/latest/Guides/Testing/

// Setup Test
test.before(async (t) => {
  //build app with the test database
  t.context.app = await buildApp({ testdb: "true" });

  //set up admin password
  const adminKey = await readFile("./adminkey", "utf8");
  const adminPassword = adminKey.split(":")[1].trim();
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
          password: t.context.adminPass,
        },
      },
    },
  });

  //save admin jwt to context
  t.context.adminJWT = response2.json().data.attributes.access_token;
  t.context.adminFgp = parse(response.headers["set-cookie"][1])["fgp"];

});

// Cleanup Test
test.after.always("cleanup tests", async (t) => {
  await unlink("./test.db");
  await unlink("./test.db-shm");
  await unlink("./test.db-wal");

  console.log("Cleaning up tests - successfully deleted test db");
});

// Start Tests

test.serial("Auth Endpoint Test: GET /auth/refresh", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      payload: {},
      headers: {
        Cookie: `userRefreshToken=${t.context.refreshToken}`,
      },
      body: JSON.stringify({})
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
          },
        },
      },
      headers: {
        Authorization: `Bearer ${t.context.jwt}`,
        cookie: `${t.context.fgp}`
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial.todo("API Endpoint Test: /auth/recovery");

test.serial("Admin Endpoint Test: POST /admin/login", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: `/v1/admin/login`,
      payload: {
        data: {
          type: "users",
          attributes: {
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
        cookie: `${t.context.adminFgp}`
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
        cookie: `${t.context.adminFgp}`
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
        cookie: `${t.context.adminFgp}`
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
        cookie: `${t.context.adminFgp}`
      },
    });
    t.is(response.statusCode, 204, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});
