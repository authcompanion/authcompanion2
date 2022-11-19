# Integrate

## With Backend Web Services

When you start the AuthC server a secret key is generated on `KEY_PATH=./keyfile` (in the JSON Web Key format). This key is used to verify the JWT token received by your web services.

Through an environment variable or by reading the key from a file, your web service requires access to the JWK. 

Example ./keyfile that the web service will use. This key is provided to you by AuthC when turned on. Both the key on the AuthC user management server and your web service must match, even if they live on different servers. 

```javascript
// ./keyfile
{
  "key_ops": [
    "sign",
    "verify"
  ],
  "ext": true,
  "kty": "oct",
  "k": "EClK3wR3GxRM2sIAfZE00IGkpM_HeTVdy_H93_EqDcddonfEMWQpSrtGju_xFC9vGUAzHAcREbUe1XeodmTZ2Q",
  "alg": "HS256"
}
```
Next, import the JWK for use in verifying tokens received by your API server. 

```javascript
// ./key.js
import { readFileSync } from "fs";
import fastifyPlugin from "fastify-plugin";
import { webcrypto } from "crypto";

const { subtle } = webcrypto;

export async function importKey() {
  try {
    const rawKey = readFileSync("./keyfile");
    const importkey = JSON.parse(rawKey);

    const key = await subtle.importKey(
      "jwk",
      importkey,
      {
        name: "HMAC",
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );
    return key;
  } catch (error) {
    console.log(error);
  }
}
```
With the key imported, you can use a library like https://github.com/panva/jose to both verify the JWT (using the secret key) and access the payload contents to learn more about the user who wants to authenticate with your API. 

```javascript
// jwt.js
import * as jose from "jose";
import { importKey } from "./key.js";

export async function validateJWT(jwt) {
  try {
    const secretKey = await importKey();

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return payload;
  } catch (error) {
    throw { statusCode: error.statusCode, message: "Server Error" };
  }
}
```
Passing the verification step allows the request to access the API resources - any errors should deny the request. 