# Configure

This guide will help you set up and customize AuthCompanion ("AuthC") for your development or production environment.

---

## Quick Start

- **For Development:**  
  The default configuration works out-of-the-box. You may optionally use a `.env` file for custom settings.
- **For Production:**  
  Secure your configuration and review all options carefully. See the [Launch Guide](launch.md) for production best practices.

---

## How to Configure

1. **Copy the Example Configuration**

   - Locate `env.example` in the project root.
   - Copy it to a new file named `.env` in the same directory.

   ```sh
   cp env.example .env
   ```

2. **Edit Your `.env` File**

   - Open `.env` with your favorite editor.
   - Adjust settings as needed (see below for option details).

3. **Start or Restart AuthC**
   - The server loads your `.env` file automatically when starting.
   - Restart the server whenever you change `.env`.

---

## Configuration Options Summary

| Option                         | Description                                                                           | Example/Default                           |
| ------------------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| `PORT`                         | Port number where AuthC listens.                                                      | `3002`                                    |
| `ORIGIN`                       | Public URL of your AuthC server—used for logins and passkey registration.             | `http://localhost:3002`                   |
| `APPLICATION_ORIGIN`           | Where to redirect the user after login/profile update.                                | `http://localhost:3002/home`              |
| `REGISTRATION_ORIGIN`          | Where to redirect after new registration (defaults to `APPLICATION_ORIGIN` if unset). | _(optional)_                              |
| `SERVER_KEY_PATH`              | Path to the JSON Web Key used for signing/verifying JWTs.                             | `./serverkey`                             |
| `ADMIN_KEY_PATH`               | Path to password file for Admin API and UI login.                                     | `./adminkey`                              |
| `SAMESITE`                     | Cookie SameSite policy (`None`, `Lax`, or `Strict`).                                  | `None`                                    |
| **Email Settings**             |                                                                                       |                                           |
| `RECOVERY_REDIRECT_URL`        | URL for password recovery email link—user lands here to reset their password.         | `http://localhost:3002/profile`           |
| `SMTP_HOSTNAME`                | SMTP server hostname for outbound email.                                              | _(empty by default)_                      |
| `SMTP_PORT`                    | SMTP server port.                                                                     | `2525`                                    |
| `SMTP_USERNAME`                | SMTP username.                                                                        | _(empty by default)_                      |
| `SMTP_PASSWORD`                | SMTP password.                                                                        | _(empty by default)_                      |
| `FROM_ADDRESS`                 | Email address used as the sender for AuthC emails.                                    | `no_reply@example.com`                    |
| **Database Settings**          |                                                                                       |                                           |
| `SQLITE_ENABLED`               | Enable SQLite (boolean: `true`/`false`).                                              | `true`                                    |
| `POSTGRESQL_ENABLED`           | Enable PostgreSQL (boolean: `true`/`false`).                                          | `false`                                   |
| `SQLITE_DB_PATH`               | Path to SQLite database file.                                                         | `./sqlite_authc_database.db`              |
| `POSTGRESQL_CONNECTION_STRING` | PostgreSQL connection string.                                                         | `postgresql://admin@localhost:5432/users` |

---

## Additional Notes

- **Security:**  
  Never commit your `.env` file to version control if it contains secrets.
- **Default Configuration:**  
  If no `.env` file is found, AuthC loads settings from the default config: [`config.js`](https://github.com/authcompanion/authcompanion2/blob/main/config.js)
- **More Details:**  
  The full example configuration with inline documentation can be found at [`env.example`](https://github.com/authcompanion/authcompanion2/blob/main/env.example)

---

## Need More Help?

- See the [Launch Guide](launch.md) for production deployments.
- For a detailed description of every config option, check [`env.example`](https://github.com/authcompanion/authcompanion2/blob/main/env.example).
