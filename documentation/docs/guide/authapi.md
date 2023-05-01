# Authentication API

The RESTful Authentication API powers the Web Forms by which users authenticate
into your web application. It's important to note that the web forms don't cover every auth
flow for your users; using both the Auth API and Web Forms will
help cover your use cases.

## Server URL

http://localhost:3002/v1/

Returns Content-Type: application/json

## Endpoints

### auth/register

Description: Register a user. Returns a JWT access token and sets a refresh
token (as a http only cookie). JWTs are used by your web application to authenticate
a user with your backend APIs.

**POST** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "password": "mysecretpass"
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "f1b84e9c-4e5d-4c4a-8571-e1577aefa968",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "created": "2023-02-21T15:22:11.471Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJmMWI4NGU5Yy00ZTVkLTRjNGEtODU3MS1lMTU3N2FlZmE5NjgiLCJuYW1lIjoiQXV0aHkgUGVyc29uIiwiZW1haWwiOiJoZWxsb0BhdXRoY29tcGFuaW9uLmNvbSIsImlhdCI6MTY3Njk5MjkzMSwiZXhwIjoxNjc2OTk2NTMxfQ.aX0EtnIsSUvHkuHZyiE1p_fHqB2MJWXF3u2rY1YWXqM",
      "access_token_expiry": 1676996531
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
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "hello@authcompanion.com",
      "password": "mysecretpass"
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "f1b84e9c-4e5d-4c4a-8571-e1577aefa968",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "created": "2023-02-21T15:22:11.471Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJmMWI4NGU5Yy00ZTVkLTRjNGEtODU3MS1lMTU3N2FlZmE5NjgiLCJuYW1lIjoiQXV0aHkgUGVyc29uIiwiZW1haWwiOiJoZWxsb0BhdXRoY29tcGFuaW9uLmNvbSIsImlhdCI6MTY3Njk5ODY4MiwiZXhwIjoxNjc3MDAyMjgyfQ.HSSCH76BHKFIaO120RZH98TSd9HFqDJOT_xee5tJoec",
      "access_token_expiry": 1677002282
    }
  }
}
```

---

### auth/users/me

Description: Update the user's record by changing either their name, email and
password.

Bearer Token Required: `Authorization: Bearer {user's access token}`

All fields in the user's attributes are optional.

**POST** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Authy Person_updated",
      "email": "hello@authcompanion.com",
      "password": "mysecretpass"
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "d6978388-07d4-4c79-ad7f-e26ee758eebc",
    "attributes": {
      "name": "Authy Person_update",
      "email": "hello_update@authcompanion.com",
      "created": "2023-02-21T02:47:24.460Z",
      "updated": "2023-02-21T03:55:54.422Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJkNjk3ODM4OC0wN2Q0LTRjNzktYWQ3Zi1lMjZlZTc1OGVlYmMiLCJuYW1lIjoiQXV0aHkgUGVyc29uX3VwZGF0ZSIsImVtYWlsIjoiaGVsbG9fdXBkYXRlQGF1dGhjb21wYW5pb24uY29tIiwiaWF0IjoxNjc2OTUxNzU0LCJleHAiOjE2NzY5NTUzNTR9.JyPuTCX3g9Hs5fOikNx5vNYfP8-ofMCqmvByfVlXIEQ",
      "access_token_expiry": 1676955354
    }
  }
}
```

---

### auth/recovery

Description: If the request has a valid user email, issue an account recovery
email which contains a URL with a recovery token. The recovery token is valid for 15 minutes. When a user clicks on the "reset password" link in the email, they will be redirected to the `web/profile` page.

**POST** Request Body:

```json
{ "email": "hello@authcompanion.com" }
```

Response:

```json
{
  "data": {
    "type": "users",
    "detail": "Recovery email sent"
  }
}
```

---

### auth/refresh

Description: Your user's access token (JWTs) will expire according the exp date. When it does, you
can refresh the access token without asking your user to log in again.

If the request has a valid refresh token (stored as http only cookie) AuthCompanion will return a new
access token and set a new refresh token (http only cookie).

Cookie required: `refreshToken={user's refresh token}`

**POST**

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
