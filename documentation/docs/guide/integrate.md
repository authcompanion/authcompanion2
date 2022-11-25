# Integrate

## With Backend Web Services

When you start the AuthC server a secret key is generated on `KEY_PATH=./keyfile` in the JSON Web Key format. Your web service requires access to the JWK via an environment variable or by reading the key from a file.

This key is used to verify the JWT token received by your web services was issued by AuthC.

The example key below is provided to you by AuthC on first start (and uses an existing keyfile if one is available). Both the key on the AuthC server and your web service must match, even if they live on different servers. 

```javascript
// example ./keyfile in JWK
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
    // Or import the key earlier
    const secretKey = await importKey();

    const { payload } = await jose.jwtVerify(jwt, secretKey);

    return payload;
  } catch (error) {
    throw { statusCode: error.statusCode, message: "Server Error, Token Validation Failed" };
  }
}
```
Passing the verification step allows the request to access the API resources - any errors should deny the request. 

## With Frontend Clients

After a user's successful account registration or login, AuthC will save the users JWT in local storage and Refresh token as a cookie, then redirect the user to your frontend application.

Let AuthC know where to redirect a user by setting the config `APPLICATION_ORIGIN=http://localhost:3002/v1/web/home` - right now it defaults to AuthC's temporary home page. 

With the token your web application can now:
- Check if a user is logged in by seeing if the JWT variable is set. If it isn't redirect the user to the login page. 
- Retrieve the token from local storage and add it as a Bearer HTTP `authentication` header when calling backend APIs/services.
- Decode the JWT on the client to access data in the payload - which provides more information about the user. 
- Logout a user by simply deleting the token on the client side, so that it can't be used for subsequent API calls. 
- Redirect the user to login again if an API response comes back with a validitation error that a token is expired/invalid.
- Refresh the token, should it expire, using the Refresh Token cookie set by AuthCompanion without having the user login again ("silent refresh")
