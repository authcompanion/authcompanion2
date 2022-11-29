import buildApp from "../app.js";
import test from "ava";
import { unlink } from "node:fs/promises";
import config from "./config.js";

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
  //build app with a test database
  t.context.app = await buildApp({ testdb: "true" });
});

test.after.always("cleanup tests", async (t) => {
  await unlink("./test.db");
  console.log("Cleaning up tests - successfully deleted ./test.db");
});

let replyPayload = {};

// Start Tests
test.serial("API Endpoint Test: /auth/register", async (t) => {
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

test.serial("API Endpoint Test: /auth/login", async (t) => {
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

test.serial("API Endpoint Test: /auth/users/me", async (t) => {
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

test.serial("API Endpoint Test: /auth/refresh", async (t) => {
  try {
    const response = await t.context.app.inject({
      method: "POST",
      url: "/v1/auth/refresh",
      headers: {
        Cookie: `${replyPayload.cookies[0].name}=${replyPayload.cookies[0].value}`,
      },
    });
    t.is(response.statusCode, 200, "API - Status Code Incorrect");
  } catch (error) {
    console.log(error);
  }
});

// test.serial("API Endpoint Test: /auth/recovery", async (t) => {
//   try {
//     const response = await t.context.app.inject({
//       method: "POST",
//       url: "/v1/auth/recovery",
//       payload: {
//         email: "hello1@authc.com",
//       },
//     });

//     t.is(response.statusCode, 200, "API - Status Code Incorrect");
//   } catch (error) {
//     console.log(error);
//   }
// });
