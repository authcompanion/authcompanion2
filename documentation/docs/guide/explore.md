# Explore

Let's begin familiarizing ourselves with AuthCompanion.

## Registering a User

AuthCompanion is an application which takes care of the the user authentication
for your web applications. Let's pretend to be a user who wants to log into your
application.

AuthC comes with pre-built [Web Forms](#web-forms-for-authentication) to help
you quickly integrate user auth alongside your web application.

With the AuthC server running, start first by registering an account using this
Web Form located at: http://localhost:3002/v1/web/register

After a successful login or account registration, AuthC provides developers a
user's access token below:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3YjUyMjY3ZS1iMzE0LTQ5N2ItYjdkZC00YTk4NTFiMGUzZWQiLCJuYW1lIjoiQXV0aHkgUGVyc29uIiwiZW1haWwiOiJoZWxsb193b3JsZEBhdXRoY29tcGFuaW9uLmNvbSIsImlhdCI6MTY1OTE0NzczOCwiZXhwIjoxNjU5MTUxMzM4fQ.361v5zBBGStcov1g6Z-WGi5zAGN9JZ-trYMz5cBiyHI
```

The access token contains information about the user. Decode the token's payload
[here](https://jwt.io/#debugger-io?token=eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI3YjUyMjY3ZS1iMzE0LTQ5N2ItYjdkZC00YTk4NTFiMGUzZWQiLCJuYW1lIjoiQXV0aHkgUGVyc29uIiwiZW1haWwiOiJoZWxsb193b3JsZEBhdXRoY29tcGFuaW9uLmNvbSIsImlhdCI6MTY1OTE0NzczOCwiZXhwIjoxNjU5MTUxMzM4fQ.361v5zBBGStcov1g6Z-WGi5zAGN9JZ-trYMz5cBiyHI)
to find out more about the user who registered.

Store AuthCompanion's access token in your front-end application's memory and
use it to both understand 1) who the user is and 2) pass it along as an
authentication method into your app's backend APIs.

Lastly, you'll want to refresh the access token with AuthCompanion's /refresh
endpoint before it expires!

When you're ready, tell AuthC to redirect users after they login to your
application's home page (instead of the one the comes built-in with
AuthCompanion).

In AuthCompanion's .env file change "APPLICATION_ORIGIN" to the URL of your
application. Example:

APPLICATION_ORIGIN=http://localhost:3002/client/v1/home

## Login as User

Next, log in with the account you just created using your email and password at
this Web Form:
[http://localhost:3002/v1/web/login](http://localhost:3002/v1/web/login). You
should be redirected back to the home page.

## Change User's Profile

If you'd like to change your user account - that's easy to do as well, try this
Web Form:
[http://localhost:3002/v1/web/profile](http://localhost:3002/v1/web/profile).

## Recover an Account

Have you forgotten your account details? Use the recovery flow Web Form to gain
access to your account:
[http://localhost:3002/v1/web/recovery](http://localhost:3002/v1/web/recovery).
