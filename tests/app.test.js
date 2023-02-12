import buildApp from "../app.js";
import test from "ava";
import { unlink } from "node:fs/promises";

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

// Setup Application
test.before(async (t) => {
  try {
    //build app with the test database
    t.context.app = await buildApp({ testdb: "true" });

    //create a user to test with, and save the uuid to the context
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        name: "Test User",
        email: "testuser@authcompanion.com",
        password: "supersecret",
      },
    });
    // Get the data.id from the response and save it to the context
    // so we can use it in the next test
    t.context.uuid = response.json().data.id;
    t.context.jwt = response.json().data.attributes.access_token;
  } catch (error) {
    throw new Error("Failed to setup test");
  }
});

test.after.always("cleanup tests", async (t) => {
  await unlink("./test.db");
  await unlink("./test.db-shm");
  await unlink("./test.db-wal");

  console.log("Cleaning up tests - successfully deleted test db");
});

let replyPayload = {};

// Start Tests
test.serial("Auth Endpoint Test: /auth/register", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: {
        name: "Authy Person",
        email: "hello@authc.com",
        password: "supersecret",
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Auth Endpoint Test: /auth/login", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "hello@authc.com",
        password: "supersecret",
      },
    });
    replyPayload = response;
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Auth Endpoint Test: /auth/users/me", async (t) => {
  try {
    const replyObj = replyPayload.json();

    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/users/me",
      payload: {
        name: "Authy Person1",
        email: "hello1@authc.com",
        password: "supersecret1",
      },
      headers: {
        Authorization: `Bearer ${replyObj.data.attributes.access_token}`,
      },
    });
    replyPayload = response;
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial("Auth Endpoint Test: /auth/refresh", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      payload: {},
      headers: {
        Cookie: `${replyPayload.cookies[0].name}=${replyPayload.cookies[0].value}`,
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

test.serial.todo("API Endpoint Test: /auth/recovery");

test.serial("Admin Endpoint Test: GET /admin/users", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "GET",
      url: "/v1/admin/users",
      headers: {
        Authorization: `Bearer ${t.context.jwt}`,
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
            email: "mytestuser@authcompanion.com",
            password: "supersecret",
          },
        },
      },
      headers: {
        Authorization: `Bearer ${t.context.jwt}`,
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
        Authorization: `Bearer ${t.context.jwt}`,
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
        Authorization: `Bearer ${t.context.jwt}`,
      },
    });
    t.is(response.statusCode, 204, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});
