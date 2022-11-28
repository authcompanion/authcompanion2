# Integrate

## With Backend Web Services

When you start the AuthC server a secret key is generated on `KEY_PATH=./keyfile` in the JSON Web Key format. Your web service requires access to the JWK via an environment variable or by reading the key from a file.

This key is used to verify the JWT token received by your web services was issued by AuthC.

The example key below is provided to you by AuthC on first start (and uses an existing keyfile if one is available). Both the key on the AuthC server and your web service must match, even if they are hosted on different servers.

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

With the key imported, you can use a library like [https://github.com/panva/jose](https://github.com/panva/jose) to both verify the JWT (using the secret key) and access the payload contents to learn more about the user.

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
    throw {
      statusCode: 401,
      message: "Server Error, Token Validation Failed",
    };
  }
}
```

Passing the verification step allows the request to access the API resources - any errors should deny the request.

## With Frontend Clients

After a user's successful account registration or login, AuthC will first save the user's JWT in local storage and Refresh token as a cookie, then redirect the user to your frontend application.

Let AuthC know where to redirect a user by setting the config `APPLICATION_ORIGIN=http://localhost:3002/v1/web/home` - this is typically your web application's home page. 

With the access token your web application can now:

- Check if a user is logged in by seeing if the JWT variable is set. If it isn't, redirect the user to the login page.

```javascript
if (!localStorage.getItem("ACCESS_TOKEN")) {
  window.location.href = "http://auth.example.com";
}
```

- Retrieve the token from local storage and add it as a Bearer HTTP `authentication` header when calling backend APIs/services.

```javascript
const token = localStorage.getItem("ACCESS_TOKEN");

const response = await fetch(yourWebService, {
  method: "POST",
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${token}`, // notice the Bearer + AuthC's access token
  },
  body: JSON.stringify(yourData),
});

const result = await response.json();
console.log(result);
```

- Decode the JWT on the client to access data in the payload - which provides more information about the user.

```javascript
import jwtDecode from "https://cdn.skypack.dev/jwt-decode";

const token = localStorage.getItem("ACCESS_TOKEN");

let decodedClaims = jwtDecode(token);
console.log(decodedClaims);

/* prints:
 * {
 *   "userid": "2e9327c3-1e1d-4bab-8581-6f0a0310729b",
 *   "name": "AuthyPerson",
 *   "email": "hello@authcompanion.com",
 *   "iat": 1669173749,
 *   "exp": 1669177349
 * }
 */
```

- Logout a user by simply deleting the token on the client side, so that it can't be used for subsequent API calls.

```javascript
function LogoutUser() {
  localStorage.removeItem("ACCESS_TOKEN");
}
```

### Implement the "Silent Refresh" for JWTs

Silent refresh is a mechanism to generate a new access token using a refresh token automatically. This is true when the access token is expired but refresh token is available and valid. 

AuthC has a defauly expiration of 1 hour for all short lived access tokens; making the Silent Refresh an important implementation step to prevent users from needlessly logging in. 

Implementing the "Silent Refresh" follows three steps:

1. Access your web service resource with the access token set by AuthC
2. if 401 - Unauthorized is returned by server, Get a new access token by using the Refresh token with AuthC's `/auth/refresh` endpoint
3. Retry step 1 using the new access token

```javascript
async function callBackend() {
  //get AuthC's ACCESS_TOKEN from the browser's local storage
  const token = localStorage.getItem("ACCESS_TOKEN");

  //make an API request to your web service. Include the ACCESS_TOKEN.
  const response = await fetch("/private/resource", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(yourRequestData),
  });

  return response;
}

try {
  //make a normal request to your web service
  const response = callBackend();

  const webserviceResponse = await response.json();

  //if the response comes back as unauthorized (the access_token was expired), let's fetch from AuthC a new ACCESS_TOKEN
  if (response.status === 401) {
    //AuthC's refresh endpoint requires the Refresh Token (set by AuthC as a cookie when user logs in) in order to provide you a new ACCESS_TOKEN
    const response = await fetch("http://127.0.0.1:3002/v1/auth/refresh", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: "",
    });
    //AuthC will store the ACCESS_TOKEN in local storage or you can access it from the response itself!
    const refreshResponse = await response.json();

    //make another request to your web service, this time with a new ACCESS_TOKEN
    const response = callBackend();
  }
} catch (error) {
  //catch any errors
  console.error(error);
}
```
