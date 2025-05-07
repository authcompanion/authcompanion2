# Launch 🚀

This guide walks you through deploying the AuthCompanion server on [Fly.io](https://fly.io/), from initial setup to production-ready configuration. You'll use a container image (from the [Dockerfile](https://github.com/authcompanion/authcompanion2/blob/main/dockerfile)) and configure your application with a `fly.toml` file. Let's get started!

---

## 1. Prerequisites

- **Install Flyctl**:  
  Follow [Fly.io's install instructions](https://fly.io/docs/hands-on/install-flyctl/).
- **Sign up for Fly.io**:  
  Requires a credit card, but you can use the [free tier](https://fly.io/docs/about/pricing/).

---

## 2. Project Setup

1. **Clone and Enter the Project Directory**

   ```bash
   git clone https://github.com/authcompanion/authcompanion2.git
   cd authcompanion2/
   ```

2. **Initialize the Fly App**

   ```bash
   flyctl launch
   ```

   - _Say **No** to setting up a Postgres database._
   - _Say **No** to deploying now (you'll configure first)._

---

## 3. fly.toml Configuration

Fly.io uses `fly.toml` to describe your deployment. After `flyctl launch`, edit the file as follows:

### **Mandatory Environment Variables**

In the `[env]` section of `fly.toml`, set these (replace with your app's values):

```toml
[env]
  # Public URL for authentication (required for passkeys)
  ORIGIN = "https://<your-app>.fly.dev"
  # Where users are redirected after login/register
  APPLICATION_ORIGIN = "https://<your-app>.fly.dev/v1/web/home"
  # AuthCompanion Admin dashboard (optional; set for user management)
  ADMIN_ORIGIN = "http://demo.authcompanion.com/v1/admin/dashboard"
```

### **Set the Internal Port**

In the `[[services]]` section:

```toml
[[services]]
  internal_port = 3002
  # ...rest unchanged...
```

### **Example fly.toml Snippet**

```toml
app = "<your-app-name>"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[env]
  ORIGIN = "https://<your-app>.fly.dev"
  APPLICATION_ORIGIN = "https://<your-app>.fly.dev/v1/web/home"
  ADMIN_ORIGIN = "http://demo.authcompanion.com/v1/admin/dashboard"

[[services]]
  internal_port = 3002
  # ...rest of your service config...
```

---

## 4. Deploy to Fly.io

```bash
flyctl deploy
```

- After deployment, visit: `https://<your-app>.fly.dev/v1/web/login`
  - _Replace `<your-app>` with the value in your `fly.toml`_

---

## 5. Configure a Custom Domain (Optional)

1. **Get your app’s IPs:**

   ```bash
   flyctl ips list -a <your-app>
   ```

2. **Update DNS:**  
   Add `A` and `AAAA` records for your domain (e.g., `auth.example.com`) pointing to the IPs from above.

3. **Provision a TLS Certificate:**

   ```bash
   flyctl certs add auth.example.com -a <your-app>
   flyctl certs show auth.example.com -a <your-app>
   ```

4. **Update Environment Variables in `fly.toml`:**

   ```toml
   [env]
     ORIGIN = "https://auth.example.com"
     APPLICATION_ORIGIN = "https://auth.example.com/v1/web/home"
     # ...other env vars...
   ```

5. **Redeploy:**

   ```bash
   flyctl deploy
   ```

   Now, visit: `https://auth.example.com`

---

## 6. Persistent Storage

AuthCompanion stores users in a SQLite database file. To persist data across restarts:

1. **Create a Volume:**

   ```bash
   fly volumes create authc_userdata --region <region> --size 1 --no-encryption
   ```

   - _Find your region code: [Fly.io Regions](https://fly.io/docs/reference/regions/)_

2. **Add to `fly.toml`:**

   ```toml
   [[mounts]]
     source = "authc_userdata"
     destination = "/data"
   ```

3. **Update `[env]` for persistent paths:**

   ```toml
   [env]
     SERVER_KEY_PATH = "/data/keyfile"
     SQLITE_DB_PATH  = "/data/authcompanion_users.db"
     # ...other env vars...
   ```

4. **Redeploy:**

   ```bash
   flyctl deploy
   ```

---

## 7. Outbound Email (Account Recovery)

To enable password recovery (and similar features), configure SMTP settings:

1. **Set Email Environment Variables in `fly.toml`:**

   ```toml
   [env]
     RECOVERY_REDIRECT_URL = "https://auth.example.com/v1/web/profile"
     SMTP_HOSTNAME         = "smtp.migadu.com"
     SMTP_PORT             = 465
     SMTP_USERNAME         = "<your-username>"
     SMTP_PASSWORD         = "$SMTP_PASSWORD"
     FROM_ADDRESS          = "<your-email>"
   ```

2. **Set SMTP Password as a Secret:**

   ```bash
   flyctl secrets set SMTP_PASSWORD=<yourpassword>
   ```

3. **Redeploy:**

   ```bash
   flyctl deploy
   ```

---

## 8. Example `fly.toml` (from the AuthCompanion Demo)

See the [demo fly.toml](https://github.com/authcompanion/authcompanion2/blob/main/fly.toml) for a full reference:

```toml
app = "demo-authcompanion"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[env]
ORIGIN="https://demo.authcompanion.com"
APPLICATION_ORIGIN="https://demo.authcompanion.com/home"
SERVER_KEY_PATH="/data/serverkeyv5"
ADMIN_KEY_PATH="/data/adminkeyv5"
SQLITE_DB_PATH="/data/sqlite_authc_databasev5.db"
RECOVERY_REDIRECT_URL="https://demo.authcompanion.com/profile"
SMTP_HOSTNAME="smtp.migadu.com"
SMTP_PORT=465
SMTP_USERNAME="hello@authcompanion.com"
SMTP_PASSWORD="$SMTP_PASSWORD"
FROM_ADDRESS="hello@authcompanion.com"

[[services]]
  internal_port = 3002
  # ...rest unchanged...

[[mounts]]
  source = "authc_userdata"
  destination = "/data"
```

---

## 9. Troubleshooting & Further Help

- If you run into issues, see [Getting Help](../contributing/gettinghelp.md).
- For more configuration examples, check the [official fly.toml](https://github.com/authcompanion/authcompanion2/blob/main/fly.toml).

---

**You’re all set!**  
Enjoy a secure, scalable AuthCompanion deployment on Fly.io.
