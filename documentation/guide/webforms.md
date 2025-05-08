# Web Forms

AuthCompanion includes ready-to-use web forms for user authentication and management, so you can quickly add login and registration flows to your application without building them from scratch. Simply host the AuthCompanion server and direct your users to these endpoints.

These forms are implemented with [Vue.js](https://v3.vuejs.org/) and styled using [Tabler](https://tabler.io/), allowing quick customization for your branding and authentication requirements directly.

---

## Web Form Endpoints

Below are the available web form routes provided by the AuthCompanion user management server:

| Path        | Description                                                                                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/register` | New user registration. Allows users to create new accounts.                                                                                                                                                          |
| `/login`    | User authentication. Supports passkey and username/password login.                                                                                                                                                   |
| `/profile`  | User profile management. Users can update their email, password, and display name.                                                                                                                                   |
| `/recovery` | Account recovery. Initiates the password reset/forgot password flow.                                                                                                                                                 |
| `/home`     | Post-login/register landing page. You should configure your app to redirect users here after authentication.<br>Set `APPLICATION_ORIGIN=http://localhost:3002/home` in your config to customize the redirect target. |

**Example (default local URLs):**

- Register: `http://localhost:3002/register`
- Login: `http://localhost:3002/login`
- Profile: `http://localhost:3002/profile`
- Recovery: `http://localhost:3002/recovery`
- Home: `http://localhost:3002/home`

---

## Customization

- **Branding:** Easily modify the look and feel of these forms by editing the Vue.js and Tabler-based templates in your AuthCompanion installation.
- **Redirects:** After login or registration, AuthCompanion routes users your application home page like `/home`. Change the `APPLICATION_ORIGIN` environment variable to redirect users to your application's homepage or dashboard.

---

## Screenshots

|                                              Login Screen                                              |                                             Registration Screen                                              |
| :----------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| ![Login](https://raw.githubusercontent.com/authcompanion/authcompanion2/main/.github/public/login.png) | ![Register](https://raw.githubusercontent.com/authcompanion/authcompanion2/main/.github/public/register.png) |

---

By using these built-in web forms, you can integrate user authentication and management into your app without the hassle of building and maintaining your own UI for these flows.
