<p align="center">
  <a href="https://github.com/authcompanion/authcompanion2" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/VjsHEC9.png" alt="Project logo"></a>
</p>

<h2 align="center"><b>AuthCompanion 2</b></h2>

<p align="center"> An effortless, token-based user management server - well suited for modern web projects.
</p>

<div align="center">

  <a href="">
     <img alt="Active" src="https://img.shields.io/badge/status-looking%20for%20early%20adopter%20feedback-orange?">
   </a>
   <a href="https://github.com/authcompanion/authcompanion2/stargazers">
     <img alt="GitHub stars" src="https://img.shields.io/github/stars/authcompanion/authcompanion2">
   </a>
   <a href="https://nodejs.org/en/">
     <img src="https://img.shields.io/badge/node-v18.5.0-green?logo=node.js"/>
   </a>
      <a href="https://github.com/authcompanion/authcompanion2/tags">
     <img src="https://img.shields.io/github/v/release/authcompanion/authcompanion2?color=purple&include_prereleases&style=flat-square"/>
   </a>

</div>
<br />
<p align="center">  <a href="https://docs.authcompanion.com/"> Documentation</a> | <a href="https://github.com/authcompanion/authcompanion2/blob/main/CHANGELOG.md"> CHANGELOG</a>
</p>

---

## Introduction

AuthCompanion aims to satisfy the most common authentication and user management needs for your web application.

With AuthC you can:

- Securely handle the registration, login, logout, and account recovery of user accounts.
- Generate and validate [JWTs](https://jwt.io/introduction), a token used for your user's session and authenticating them into your web application's backend APIs
- Confidently store and own your web application's user accounts
- Support users registering and logining in with a passkey on their mobile device (aka passwordless) or with traditional username/passwords instead

## Try it

The instructions below will launch the default server for integration purposes.

Please see the env.example file for more details on the server configuration
options as you move AuthC into production.

### With Docker

Make sure to have the
[respository cloned](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
Then from the main directory, build the AuthC server image:

```bash
$ docker build -t authc_server .
```

Start the server (default config):

```bash
$ docker run --name authcompanion \
 -p 3002:3002 \
authc_server
```

### From Source

Pre-requirement:

- [Node.js](http://nodejs.org) **version 16+**

Clone the repo if you haven't done so, and install dependencies using this
command:

```bash
$ npm install
```

When you're ready, start the server with the default settings!

```bash
$ npm run start
```

---

## Explore

### 1. Create a user

AuthC comes with pre-built [Web Forms](#web-forms-for-authentication) to help
you quickly integrate user auth alongside your web application.

With the AuthC server running, start first by registering an account using this
web form: http://localhost:3002/v1/web/register

### 2. Login as the new user

Next, log in with the account you just created using your email and password at
this web form: http://localhost:3002/v1/web/login. The server response includes
an access token for use when authenticating to backend APIs and redirects the user to your application's home page.

### 3. Examine the APIs

Lastly, have a read through the [Authentication API](#authentication-api) for
information on how you can manage user authentication for your web app. Both the built-in Web Forms and Auth API work together to get up and running with user auth
quickly.

---

## Features

- [x] **Web Forms for User Authentication:** Use pre-built and customizable web
      forms for your application users to: log in with their credentials,
      register an account, update their profile, and issue forgotten passwords.

- [x] **Manage User Profiles and JWTs:** Update the password and profile
      information of your users - all account information is stored in a SQLite
      database. Easily manage the life-cycle of your user's JWT used for
      authentication.

- [x] **User Account Recovery:** Restore a user's access to their account using
      the **Forgot Password** flow which sends a special link via email for
      helping users quickly recover their account.

- [x] **Extensible Platform:** AuthC supports a
      [plugin system](https://www.fastify.io/docs/latest/Reference/Plugins/) for
      easily adding new functionality to cover more of your authentication needs.

- [x] **Passwordless Flow:** Streamline user Login and Registration without passwords with a user's computer or mobile phone with passkey.

### Web Forms for Authentication

The web forms are built using [Vue.js](https://v3.vuejs.org/) and
[Tailwindcss](https://tailwindcss.com/) - making them easily customizable for
your specific branding and authentication needs. No build step required to make
changes to the Web Form look and feel; just save and then view your style
changes. 👍

|             Login Screen             |            Registration Screen             |
| :----------------------------------: | :----------------------------------------: |
| ![Login](./.github/public/login.png) | ![Register](./.github/public/register.png) |
|  http://localhost:3002/v1/web/login  |   http://localhost:3002/v1/web/register    |

Also included in Authcompanion is the profile page (for updating user accounts),
available at `/profile` and the forgot password page at `/recovery`.

---

## Authentication API Docs

The RESTful Authentication API powers the web forms and is used to round out
your user authentication flows. Have a look:

### Server URL

http://localhost:3002/v1/

### Paths

Returns Content-Type: application/json

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

**POST** Request Body (optional, leave blank if cookie is available):

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

## Reference Architecture

![landscape](./.github/public/authcLandscape.png)

## Related Readings

Be sure to familiarize yourself with token-based authentication using JSON Web
Tokens.

- [The Ultimate Guide to handling JWTs on frontend
  clients](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)

- [Web Authentication Method Comparison](https://testdriven.io/blog/web-authentication-methods/#token-based-authentication)

## License

AuthCompanion is licensed under the
[Big Time Public License](https://bigtimelicense.com/versions/2.0.1). These
terms let you use and share this software for noncommercial purposes and in
small business for free, while also guaranteeing that paid licenses for big
businesses will be available on fair, reasonable, and nondiscriminatory terms.

## Contributions

Cheers for the logo design - Timothy Reeder
[(Github)](https://github.com/tokonoma)

Heavy lifting on the prototype and constant inspiration - Teddy Schmitz
[(Github)](https://github.com/Teddy-Schmitz)

---

Take AuthCompanion, the useful sidekick, into your next web project! 👏
