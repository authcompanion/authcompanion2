# Launch

In this walk-through we're going to deploy the Authcompanion server to [Fly.io](https://fly.io/).

We hand off the AuthC container image (from [Dockerfile](https://github.com/authcompanion/authcompanion2/blob/main/dockerfile)) with some deployment options to Fly.io, and we'll get back a secure (accessible via HTTPS) site for your application users to both register accounts and login.

How neat - and it's simple, lets get started!

## Step 1 - Prepare

Install the Flyctl by following these instructions. Make sure to sign-up (requires a credit card) but, don't worry, we'll deploy AuthC using the [free tier](https://fly.io/docs/about/pricing/).

Instructions: [Install Flyctl](https://fly.io/docs/hands-on/install-flyctl/)

## Step 2 - App Configuration

The Fly platform uses `fly.toml` to configure applications for deployment. Let's create one.

In the Authcompanion directory, run the following flyctl command. It's important to be in the main directory so that the AuthC Dockerfile can be detected by flyctl.

```bash
$ cd authcompanion2/
```

```bash
$ flyctl launch
```

Follow the prompts but remember to say `no` to setting up a postgres database and `no` to the option of deploying your app now (we'll do that shortly).

After this, we'll need to make 3 additions to the newly generated `fly.toml` file (highlighted below) before we can launch the application.

Set both the `ORIGIN` and `APPLICATION_ORIGIN` (like below) to match your deployment's app name in `fly.toml`.

The application_origin config tells AuthC where to redirect the user after they register or login with an account (right now it's set to the AuthC default homepage, but ultimately to your frontend application's home page). Secondly, the origin configuration tells AuthC how to set the authenticator's origin for the 'passwordless' user flow. Both are important!

Then, set the `ADMIN_ORIGIN` to the AuthC admin dashboard. This is where you'll be able to manage your users and their accounts.

Next, set the internal_port to AuthC's default port of `3002`. See the highlighted sections below generated for the cold-glitter-1600 app (but your app name will be different).

```toml{12,16,24}
# fly.toml file generated for cold-glitter-1600 on 2022-09-14T20:55:51-04:00

app = "cold-glitter-1600"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[env]
  # Your server name.
  # The URL at which registrations and authentications
  # should occur (required for passkeys).
  ORIGIN="https://cold-glitter-1600.fly.dev"
  # After a successful login or register profile update,
  # redirect the user to your main application UI using
  # the supplied URL below.
  APPLICATION_ORIGIN="https://cold-glitter-1600.fly.dev/v1/web/home"
  ADMIN_ORIGIN="http://demo.authcompanion.com/v1/admin/dashboard"

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 3002
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

## Step 3 - Launch

With the server configuration complete, let's launch the application on fly.io.

```bash
$ flyctl deploy
```

Once deployment has completed - navigate to `https://cold-glitter-1600.fly.dev/v1/web/login` and try it out (replace the URL name with your generated name)!

## Step 4 - Domain Name

In this example we'll use the app name from `fly.toml` that was generated as `cold-glitter-1600` and replace it with our example domain of `auth.example.com`.

- In the terminal run `flyctl ips list -a cold-glitter-1600` to get the IPv4 and IPv6 addresses.
- Head over to your DNS provider and add A and AAAA records for `auth.example.com` with the IPv4 and IPv6 values shown in the previous step.
- Run `flyctl certs add auth.example.com -a cold-glitter-1600`
- Run `flyctl certs show auth.example.com -a cold-glitter-1600` to watch your certificates being issued.

Next update your environment variables to reflect the new URL:

```toml{5,9}
[env]
  # Your server name.
  # The URL at which registrations and authentications
  # should occur (required for passkeys).
  ORIGIN="https://auth.example.com"
  # After a successful login or register profile update,
  # redirect the user to your main application UI using
  # the supplied URL below.
  APPLICATION_ORIGIN="https://auth.example.com/v1/web/home"
```

- Run `flyctl deploy` to restart your application with the new settings

Connect to https://auth.example.com and use your application.

## Step 5 - Persistent Storage

If you restart the AuthC app we need to make sure your database file, containing your users, is persisted (i.e isn't deleted).

First make sure to choose the region ID that you'll deploy the volume to: [https://fly.io/docs/reference/regions/](https://fly.io/docs/reference/regions/)

- Run `fly volumes create authc_userdata --region iad --size 1 --no-encryption` to create volume in the specified region and using the free tier size of 1GBs.

Next, tell our deployment about it in the `fly.toml` file (just add the following lines to the bottom):

```toml
[[mounts]]
  source = "authc_userdata"
  destination = "/data"
```

Also update the [env] section of your `fly.toml` to persist the server key and database on the new volume mount that we created.

```toml{10,11}
[env]
  # Your server name.
  # The URL at which registrations and authentications
  # should occur (required for passkeys).
  ORIGIN="https://auth.example.com"
  # After a successful login or register profile update,
  # redirect the user to your main application UI using
  # the supplied URL below.
  APPLICATION_ORIGIN="https://auth.example.com/v1/web/home"
  ADMIN_ORIGIN="http://demo.authcompanion.com/v1/admin/dashboard"
  SERVER_KEY_PATH="/data/keyfile"
  DB_PATH="/data/authcompanion_users.db"
```

- Run `flyctl deploy` to restart your application with the new settings.

Easy right? If you have trouble - make sure [to get help](../contributing/gettinghelp.md)!

## Step 6 - Outbound Email

AuthCompanion includes an account recovery flow to help your users gain access to their accounts. The flow is triggered on Web Form: `http://localhost:3002/v1/web/recovery`, after a user provides an email address.

This means you'll have to provide SMTP settings for an email server to send outbound mail generated by AuthC. [Migadu](https://www.migadu.com/index.html) is a great email service for your domain if you're looking for one.

Update `fly.toml` to include the SMTP settings of your email provider (along with the other env variables in this guide). Additionally, set the `RECOVERY_REDIRECT_URL` to redirect the user from the account recovery email to AuthCompanion's update account Web Form. This is to encourage a user to reset their password.

```toml
[env]
  # Path used in the recovery email to redirect user back
  # to the UI for updating their password
  RECOVERY_REDIRECT_URL="https://auth.example.com/v1/web/profile"

  # SMTP settings for outbound mail generated by Authc
  SMTP_HOSTNAME="smtp.migadu.com"
  SMTP_PORT=465
  SMTP_USERNAME="<your username>"
  SMTP_PASSWORD="$SMTP_PASSWORD"
  FROM_ADDRESS="<your from address, usually same as username>"
```

- Fly.io support [Setting Secrets ](https://fly.io/docs/reference/secrets/) - this means you can use the command `flyctl secrets set SMTP_PASSWORD=<yourpasswrd` in order to reference this secret value in your fly.toml using `$SMTP_PASSWORD`.
- Run `flyctl deploy` to restart your application with the new settings included.

For an example `fly.toml` file, check out AuthCompanion's configuration used to power demo.authcompanion.com - here: [https://github.com/authcompanion/authcompanion2/blob/main/fly.toml](https://github.com/authcompanion/authcompanion2/blob/main/fly.toml)

## Compare Your Configuration

AuthCompanion uses fly.io to host the demo site. If you get lost and want to see an example of a working configuration to compare with your setup - see the `fly.toml` file here:

https://github.com/authcompanion/authcompanion2/blob/main/fly.toml
