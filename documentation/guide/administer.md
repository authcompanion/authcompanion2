# Administer

## Accessing and Using the Admin Panel

The **Admin Panel** is a web-based interface designed to help administrators or web application owners manage user accounts within their application. It provides intuitive tools for creating, editing, and deleting user accounts managed by AuthCompanion.

### Accessing the Admin Panel

- **URL:**  
  By default, the Admin Panel is available at `/admin/`.  
  For local development, you can access it at:  
  `http://localhost:3002/v1/admin/login`  
  (Replace `3002` with your configured port, if different. The port is set in your `.env` file.)

### Administrator Login

- **Initial Credentials:**  
  When you first start the AuthCompanion server, an admin user is automatically created.
- **Finding Credentials:**  
  The default admin email and password are stored in a file specified by the `ADMIN_KEY_PATH` variable in your `.env` file.  
  Example:
  ```
  ADMIN_KEY_PATH=./adminkey
  ```
  Open this file to retrieve your admin login details. **Keep these credentials secure.**

### About the Admin Panel

- The Admin Panel is built using [Vue 3](https://vuejs.org/) and deployed as a Single Page Application (SPA).
- It is served directly from the AuthCompanion server; no separate deployment is necessary.
- All user management actions performed in the Admin Panel are powered by the [AuthCompanion Admin API](/reference/adminapi.md).

### Key Features

- **User Creation:** Add new users to your application.
- **User Editing:** Update user details, roles, or permissions.
- **User Deletion:** Remove user accounts as needed.
- **Secure Access:** Only authenticated administrators can access the panel.

> **Tip:** If you forget your admin credentials, you can reset or regenerate them by updating the file at `ADMIN_KEY_PATH` and restarting the server.

---

## Overview of Admin API Endpoints

The Admin Panel uses AuthCompanion's Admin API for all privileged user management operations. Below is an overview of the available admin endpoints:

| Endpoint                  | Method | Summary                               | Description                                                 |
| ------------------------- | ------ | ------------------------------------- | ----------------------------------------------------------- |
| `/v1/admin/login`         | POST   | Login Admins and receive Access Token | Log in to the admin portal and obtain a JWT for API access. |
| `/v1/admin/token/refresh` | POST   | Refresh Admin Access Token            | Refresh the admin access token using a valid refresh token. |
| `/v1/admin/logout/{uuid}` | DELETE | Logout Admin from Admin Portal        | Log out the admin user and clear session cookies.           |
| `/v1/admin/users`         | POST   | Create User Accounts                  | Create a new user account as an admin.                      |
| `/v1/admin/users`         | GET    | List User Accounts                    | Retrieve a paginated list of user accounts.                 |
| `/v1/admin/users/{uuid}`  | PATCH  | Update User Accounts                  | Update details for a specific user account.                 |
| `/v1/admin/users/{uuid}`  | DELETE | Delete User Accounts                  | Delete a user account by UUID.                              |

### Endpoint Details

- **Authentication:**  
  All endpoints require a valid admin JWT (`bearerAuth`) except for `/v1/admin/login`.

- **User Management:**

  - **Create User:**  
    `POST /v1/admin/users`  
    Body: user details (name, email, password, etc.)
  - **List Users:**  
    `GET /v1/admin/users`  
    Query params: pagination and search (e.g., by email)
  - **Update User:**  
    `PATCH /v1/admin/users/{uuid}`  
    Body: fields to update for the user
  - **Delete User:**  
    `DELETE /v1/admin/users/{uuid}`  
    Path param: user UUID

- **Admin Session Management:**
  - **Login:**  
    `POST /v1/admin/login`  
    Body: admin email and password, returns JWT
  - **Token Refresh:**  
    `POST /v1/admin/token/refresh`  
    Body: refresh token, returns new access token
  - **Logout:**  
    `DELETE /v1/admin/logout/{uuid}`  
    Path param: admin user UUID

> For the complete schema and request/response details, refer to the [Admin API Reference](/reference/adminapi.md) or your OpenAPI documentation.

---

For more advanced usage and API details, see the [Admin API Reference](/reference/adminapi.md).
