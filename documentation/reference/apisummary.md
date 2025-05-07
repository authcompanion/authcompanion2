# Server API Summary

Below is a summarized table of the key endpoints available. For detailed, interactive documentation and to try the API live, visit: [http://localhost:3002/docs/api](http://localhost:3002/docs/api) when you're running the AuthC Server.

---

## **Endpoint Summary Table**

| Path                                 | Method      | Summary                        | Tag           | Auth Required?          |
| ------------------------------------ | ----------- | ------------------------------ | ------------- | ----------------------- |
| `/v1/admin/users`                    | POST        | Create User Accounts           | Admin API     | Yes (Admin JWT)         |
| `/v1/admin/users`                    | GET         | List User Accounts             | Admin API     | Yes (Admin JWT)         |
| `/v1/admin/users/{uuid}`             | PATCH       | Update User Account            | Admin API     | Yes (Admin JWT)         |
| `/v1/admin/users/{uuid}`             | DELETE      | Delete User Account            | Admin API     | Yes (Admin JWT)         |
| `/v1/admin/login`                    | POST        | Admin Login (get token)        | Admin API     | No                      |
| `/v1/admin/token/refresh`            | POST/DELETE | Refresh Admin Access Token     | Admin API     | No (uses refresh token) |
| `/v1/admin/logout/{uuid}`            | DELETE      | Admin Logout                   | Admin API     | Yes (Admin JWT)         |
| `/v1/auth/register`                  | POST        | Register User Account          | Auth API      | No                      |
| `/v1/auth/login`                     | POST        | User Login                     | Auth API      | No                      |
| `/v1/auth/profile`                   | POST        | Update User Profile            | Auth API      | Yes (User JWT)          |
| `/v1/auth/recovery`                  | POST        | Account Recovery (send email)  | Auth API      | No                      |
| `/v1/auth/refresh`                   | POST/DELETE | Refresh User Access Token      | Auth API      | No (uses refresh token) |
| `/v1/auth/registration-options`      | POST        | WebAuthn Registration Options  | WebAuthn API  | No                      |
| `/v1/auth/registration-verification` | POST        | Complete WebAuthn Registration | WebAuthn API  | No                      |
| `/v1/auth/login-options`             | GET         | WebAuthn Auth Options          | WebAuthn API  | No                      |
| `/v1/auth/login-verification`        | POST        | Complete WebAuthn Login        | WebAuthn API  | No                      |
| `/health`                            | GET         | Server Health Check            | Health Checks | No                      |

---

## **How to Explore Further**

- **Try the API:** Open [http://localhost:3002/docs/api](http://localhost:3002/docs/api) in your browser while the server is running.
- **Interactive Documentation:** The documentation UI allows you to try endpoints, inspect request/response schemas, and view detailed requirements.
- **Authentication:** Most Admin endpoints require a Bearer JWT token; obtain one via the `/v1/admin/login` endpoint.
- **WebAuthn:** For passwordless flows, use endpoints under the _WebAuthn API_ tag.

---

For full request/response details, parameter descriptions, and advanced features, **please consult the live documentation** at [http://localhost:3002/docs/api](http://localhost:3002/docs/api).
