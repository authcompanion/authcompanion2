# Web Forms

AuthCompanion provides web forms for your application users to login, register
their accounts and trigger forgotten password flow.

These forms are built using [Vue.js](https://v3.vuejs.org/) and
[Tailwindcss](https://tailwindcss.com/) - making them easily customizable for
your specific branding and auth needs. What's great about these forms is that no
build step required to make changes to the web forms themselves; simply restart
AuthC to view your code changes. 👍

## Built-in Web Forms

|                                             Login Screen                                              |                                             Registration Screen                                             |
| :---------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: |
| ![Login](https://raw.githubusercontent.com/authcompanion/authcompanion2/main/.github/public/login.png) | ![Register](https://raw.githubusercontent.com/authcompanion/authcompanion2/main/.github/public/register.png) |
|                                  http://localhost:3002/v1/web/login                                   |                                    http://localhost:3002/v1/web/register                                    |

## Paths

- the profile page, available at `http://localhost:3002/v1/web/profile` - Here a
  user can change their account's email, password and name.
- the forgot password page at `http://localhost:3002/v1/web/recovery` - Where a
  user can trigger the forgot password flow.
