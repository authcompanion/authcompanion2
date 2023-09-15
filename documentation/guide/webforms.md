# Web Forms

AuthCompanion provides built-in web forms for your application users to login with their account, register new accounts, and trigger forgotten password should they can't login. In this way you don't have to build your own - simply host AuthC.

These forms are built using [Vue.js](https://v3.vuejs.org/) and [Tailwindcss](https://tailwindcss.com/) - making them easily customizable for your specific branding and auth needs.

## Available Web Form Paths

- **Register:** `http://localhost:3002/v1/web/register` - New user accounts are created here.
- **Login:** `http://localhost:3002/v1/web/login` - Here a user can login with their passkey or username/pass
- **Profile:**`http://localhost:3002/v1/web/profile` - Here a user can change their account's email, password and name.
- **Recovery:**`http://localhost:3002/v1/web/recovery` - Where a user can trigger the forgot password flow should they be unable to access their account
- **Home:**`http://localhost:3002/v1/web/home` - A temporary landing page for users when they they successfully login or register - AuthC should instead route the user to your application's home page using the `APPLICATION_ORIGIN=http://localhost:3002/v1/web/home` config.

|                                              Login Screen                                              |                                             Registration Screen                                              |
| :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![Login](https://raw.githubusercontent.com/authcompanion/authcompanion2/main/.github/public/login.png) | ![Register](https://raw.githubusercontent.com/authcompanion/authcompanion2/main/.github/public/register.png) |
