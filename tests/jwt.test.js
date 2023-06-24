import test from "ava";
import { makeAccesstoken } from "../utilities/jwt.js";
import { importKey } from "../plugins/key/server.key.js";
import * as jose from "jose";

test("makeAccesstoken generates a valid JWT token", async (t) => {
  const userObj = {
    uuid: "123",
    name: "John Doe",
    email: "johndoe@example.com",
  };
  const secretKey = await importKey();

  const { token, expiration, userFingerprint } = await makeAccesstoken(
    userObj,
    secretKey
  );

  // Assert that the token is not empty
  t.truthy(token);

  // Assert that the userFingerprint is not empty
  t.truthy(userFingerprint);

  // Assert that the expiration is not empty
  t.truthy(expiration);

});
