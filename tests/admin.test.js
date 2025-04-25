// import test from "ava";
// import { buildApp } from "../app.js";
// import { readFile, unlink } from "node:fs/promises";
// import { parse } from "cookie";
// import config from "../config.js";

// test.before(async (t) => {
//   t.context.app = await buildApp();

//   // Read admin credentials from file
//   const adminKeyContent = await readFile("./adminkey_test", "utf-8");
//   const [email, password] = adminKeyContent.split("\n");
//   t.context.adminCredentials = {
//     email: email.trim(),
//     password: password.trim(),
//   };
// });

// test.after.always("cleanup", async (t) => {
//   await Promise.all([unlink("./test.db"), unlink("./serverkey_test"), unlink("./adminkey_test")]);
// });

// test.serial("POST /admin/login - successful admin login", async (t) => {
//   const res = await t.context.app.inject({
//     method: "POST",
//     url: "/v1/admin/login",
//     payload: {
//       data: {
//         type: "users",
//         attributes: t.context.adminCredentials,
//       },
//     },
//   });

//   t.is(res.statusCode, 200);
//   const json = res.json();
//   t.is(json.data.type, "users");
//   t.is(json.data.attributes.email, t.context.adminCredentials.email);
//   t.truthy(json.data.attributes.access_token);

//   const cookies = parse(res.headers["set-cookie"][0]);
//   t.truthy(cookies.adminRefreshToken);
//   t.is(res.headers["x-authc-app-origin"], config.ADMINORIGIN);
// });

// // Other test cases remain similar but use t.context.adminCredentials where needed
// // ...

// test.serial("POST /admin/login - incorrect password", async (t) => {
//   const res = await t.context.app.inject({
//     method: "POST",
//     url: "/v1/admin/login",
//     payload: {
//       data: {
//         type: "users",
//         attributes: {
//           email: t.context.adminCredentials.email,
//           password: "wrong_password",
//         },
//       },
//     },
//   });

//   t.is(res.statusCode, 401);
//   t.is(res.json().message, "Invalid credentials");
// });

// // ... rest of the test cases
