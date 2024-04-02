# Administer

## Administering user accounts

The Admin Panel is a tool that allows an administrator or a web application owner to manage the users of their web application. It provides a range of functions that help administrators to create, edit, and delete user accounts stored by AuthCompanion.

On Server startup, the Admin Panel is available at the `/admin/` endpoint - `http://localhost:3002/v1/admin/login` (or the port you have configured in your `.env` file).

An admin user can log in to the Admin Panel using the credentials that are auto-created when the AuthCompanion server first starts up.

You can find the email and password within the application files at the default path described in `.env` file `ADMIN_KEY_PATH=./adminkey`.

Under the hood, the Admin Panel is a Vue.js (vue3) application that is served from the AuthCompanion server. Deployed as is a Single Page Application (SPA), it uses the AuthCompanion [Admin API](/reference/adminapi.md) to manage users.
