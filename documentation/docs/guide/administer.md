# Administer

## Administering the system
The Admin Dashboard is a tool that allows an administrator or web application owner to manage the users of a web application. It provides a range of functions that allow administrators to create, edit, and delete user accounts. 

The Admin Dashboard is a Vue.js (vue3) application that is served from the AuthCompanion server. Deployed as is a Single Page Application (SPA), it uses the AuthCompanion [Admin API](./adminapi.md) to manage users.

On Server startup, the Admin Dashboard is available at `http://localhost:3002/v1/admin/login` (or the port you have configured in your `.env` file). 

An admin user can log in to the Admin Dashboard using the credentials that are auto-created when the AuthCompanion server starts up. You can find the credentials in the application files at the default path described in `.env` file `ADMIN_KEY_PATH=./adminkey`. Only one admin user will be registered in the system at a time. 

When you log in, please change the password for the admin user to a secure password by editing the account details for the admin user with email `admin@localhost` in the Admin Dashboard.