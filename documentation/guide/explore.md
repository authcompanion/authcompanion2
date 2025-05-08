# Explore

Let's begin familiarizing ourselves with AuthCompanion and take a tour of the functionally.

The best way to learn something is by using it yourself - use this guide as the first stop toward a more deeper understanding.

If you have questions or need support - we're available in github discussions to help you navigate the AuthC user management server.

## Registering a User

AuthCompanion takes care of the user authentication for your web application. The Server comes with pre-built [Web Forms](./webforms.md) to help you quickly integrate user auth alongside your web application.

With the AuthC server running, start first by registering an account using this Web Form located at: `http://localhost:3002/register`

After a successful login or account registration, AuthC provides developers a user's access token like below:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcjgyZTM1N2hkZzV3MjdoZjRjbWNyaHQiLCJuYW1lIjoiQXV0aCBDIiwiZW1haWwiOiJhdXRoY0BleGFtcGxlLmNvbSIsInNjb3BlIjoidXNlciIsImlzcyI6ImF1dGhjb21wYW5pb24iLCJhdWQiOiJhdXRoY29tcGFuaW9uLWNsaWVudCIsImp0aSI6IjU3YjQzNzM1LWJiYTktNGM3OS1iZDNiLWNjMGJlYzhkYTE5YyIsImlhdCI6MTc0NjQ3MjE1NSwiZXhwIjoxNzQ2NDc1NzU1fQ.HUcJN_HPzCFyB6QvombA7mQ9grt0NzIpmJVgWmQUsmA
```

The access token is stored in LocalStorage and contains information about the user.

Decode the token's payload
[here](https://jwt.io/#debugger-io?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcjgyZTM1N2hkZzV3MjdoZjRjbWNyaHQiLCJuYW1lIjoiQXV0aCBDIiwiZW1haWwiOiJhdXRoY0BleGFtcGxlLmNvbSIsInNjb3BlIjoidXNlciIsImlzcyI6ImF1dGhjb21wYW5pb24iLCJhdWQiOiJhdXRoY29tcGFuaW9uLWNsaWVudCIsImp0aSI6IjU3YjQzNzM1LWJiYTktNGM3OS1iZDNiLWNjMGJlYzhkYTE5YyIsImlhdCI6MTc0NjQ3MjE1NSwiZXhwIjoxNzQ2NDc1NzU1fQ.HUcJN_HPzCFyB6QvombA7mQ9grt0NzIpmJVgWmQUsmA)
to find out more about the user who registered.

AuthCompanion stores the user's access token in the browser's `localStorage`. Make sure to use it in API requests to authenticate users (via Authorization: Bearer >token< headers) with your backend.

Lastly, you'll want to refresh the access token with AuthCompanion's `/refresh`
endpoint before it expires! For more information on how to best manage user sessions, check out the [Integration](./webforms.md) guide!

When you're ready to use AuthC along side your frontend application, tell the Server to redirect users after they login to your application's home page (instead of the one the comes built-in with
AuthCompanion).

In AuthCompanion's .env file change "APPLICATION_ORIGIN" to the URL of your
application. Example:

`APPLICATION_ORIGIN=http://localhost:3002/home # Replace with your app's URL`

## Login as User

Next, log in with the account you just created using your email and password at
this Web Form:
`http://localhost:3002/login`. You
should be redirected back to the home page.

## Change User's Profile

If you'd like to change your user account - that's easy to do as well, try this
Web Form:
`http://localhost:3002/profile`.

## Recover an Account

Have you forgotten your account details? Use the recovery flow Web Form to gain
access to your account:
`http://localhost:3002/recovery`.

AuthCompanion’s password reset system uses time-limited tokens for security. For valid users, AuthC creates a 15-minute recovery JWT and sends an email that includes a reset link `[RECOVERYURL]?token=[JWT]`
