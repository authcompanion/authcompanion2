# Authentication API

The RESTful Authentication API powers the Web Forms by which users authenticate
into your app. It's important to note that the web forms don't cover every auth
flow for your users, for example: validating the magic URL in the forgot
password flow or refreshing a token. Using both the Auth API and Web Forms will
help cover your use cases.

## Server URL

http://localhost:3002/v1/

Returns Content-Type: application/json

## Endpoints

### auth/register

Description: Register a user. Returns a JWT access token and sets a refresh
token (as a http only cookie). JWTs are used by your application to authenticate
a user so make sure to store the access token in your frontend application's
memory.

**POST** Request Body:

```json
{
  "name": "Authy Person",
  "email": "hello_world@authcompanion.com",
  "password": "mysecretpass"
}
```

Response:

```json
{
  "data": {
    "id": "6eee5ca5-d68f-4698-906d-62af6d705f05",
    "type": "Register",
    "attributes": {
      "name": "Authy Person",
      "email": "hello_world@authcompanion.com",
      "created": "2021-05-12T00:05:13.243Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI5MjAyMTgzOS1jYzk0LTQxYzctODg4YS0xYzU0OWVkMTQ5NTciLCJuYW1lIjoiQXV0aHkgUGVyc29uIiwiZW1haWwiOiJoZWxsb193b3JsZEBhdXRoY29tcGFuaW9uLmNvbSIsImlhdCI6MTY1ODcxMzkyMCwiZXhwIjoxNjU4NzE3NTIwfQ.PmmxIbv_NbcMAx5q6B-3vSyObisPryCXZLoDcLSy6Ow",
      "access_token_expiry": 1658690174
    }
  }
}
```

---

### auth/login

Description: If the request provides a valid username and password, return a JWT
access token and set a refresh token (as a http only cookie).

**POST** Request Body:

```json
{ "email": "hello_world@authcompanion.com", "password": "mysecretpass" }
```

Response:

```json
{
  "data": {
    "id": "6eee5ca5-d68f-4698-906d-62af6d705f05",
    "type": "Login",
    "attributes": {
      "name": "Authy Person",
      "email": "hello_world@authcompanion.com",
      "created": "2021-05-12T00:05:13.243Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI5MjAyMTgzOS1jYzk0LTQxYzctODg4YS0xYzU0OWVkMTQ5NTciLCJuYW1lIjoiQXV0aHkgUGVyc29uIiwiZW1haWwiOiJoZWxsb193b3JsZEBhdXRoY29tcGFuaW9uLmNvbSIsImlhdCI6MTY1ODcxNDAyOSwiZXhwIjoxNjU4NzE3NjI5fQ.fAQxLaA46V0Dc8MeCWQYDa04Qst8fLCj-fMY8ADV3sU",
      "access_token_expiry": 1658690174
    }
  }
}
```

---

### auth/users/me

Description: Update the user's record by changing their name, email and
password.

Authorization Header Required: `Authorization: Bearer {user's access token}`

The password field in the request body is optional.

**POST** Request Body:

```json
{
  "name": "Authy Person1",
  "email": "hello_world1@authcompanion.com",
  "password": "mysecretpass"
}
```

Response:

```json
{
  "data": {
    "id": "6eee5ca5-d68f-4698-906d-62af6d705f05",
    "type": "Updated User",
    "attributes": {
      "name": "Authy Person1",
      "email": "hello_world1@authcompanion.com",
      "created": "2021-05-12T00:05:13.243Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI5MjAyMTgzOS1jYzk0LTQxYzctODg4YS0xYzU0OWVkMTQ5NTciLCJuYW1lIjoiQXV0aHkgUGVyc29uMSIsImVtYWlsIjoiaGVsbG9fd29ybGQxQGF1dGhjb21wYW5pb24uY29tIiwiaWF0IjoxNjU4NzE0MDg0LCJleHAiOjE2NTg3MTc2ODR9.rxpIznLYhQ_SVBzrdLg5rT8d_20J2gV9TGC-cuFxzbI",
      "access_token_expiry": 1620800947
    }
  }
}
```

---

### auth/recovery

Description: If the request has a valid user email, issue an account recovery
email which contains a URL with a recovery token (referred to as a Magic Link).

Works together with '/auth/refresh/' to restore a user's access to an account.

Your application UI will be responsible for 1) trading the recovery token for an
access token using '/auth/refresh/' below 2) handling where to route the user
within the application once successful.

**POST** Request Body:

```json
{ "email": "hello_world1@authcompanion.com" }
```

Response:

```json
{
  "data": {
    "type": "Profile Recovery",
    "detail": "An email containing a recovery link has been sent to the email address provided."
  }
}
```

---

### auth/refresh

Description: Sometimes your access token (JWTs) will expire. When it does, you
can refresh the access token without asking your user to log in again.

If the request has a valid refresh token (stored as http only cookie) return an
access token and set a new refresh token (http only cookie).

Cookie required: `refreshToken={user's refresh token}`

OR If the request has a valid and short lived recovery token (issued from the
recovery email), trade it for a new access token (on this same route), so the
user can login. This completed the "Forgot Password" user flow!

**POST** Request Body (optional, leave blank obj if cookie is available):

```json
{ "token": "{user's recovery token here}" }
```

Response:

```json
{
  "data": {
    "id": "6eee5ca5-d68f-4698-906d-62af6d705f05",
    "type": "Refresh",
    "attributes": {
      "name": "Authy Person",
      "email": "hello_world@authcompanion.com",
      "created": "2021-05-12T00:05:13.243Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI5MjAyMTgzOS1jYzk0LTQxYzctODg4YS0xYzU0OWVkMTQ5NTciLCJuYW1lIjoiQXV0aHkgUGVyc29uMSIsImVtYWlsIjoiaGVsbG9fd29ybGQxQGF1dGhjb21wYW5pb24uY29tIiwiaWF0IjoxNjU4NzE0NDI5LCJleHAiOjE2NTg3MTgwMjl9.SgQuxEuK3sDib9N5Iuu3hNHNAubwUc47iit8RRZklhA",
      "access_token_expiry": 1620800860
    }
  }
}
```

---
