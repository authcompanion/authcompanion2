# Launch

In this walk-through we're going to deploy the Authcompanion server to [Fly.io](https://fly.io/). All we do is hand off the AuthC container image (via [Dockerfile](https://github.com/authcompanion/authcompanion2/blob/main/dockerfile)) with some deployment options, and we'll get back a secure  (accessible via HTTPS) site for your application users to register accounts and login. It's simple, lets get started. 

## Step 1 - Prepare

Install the Flyctl by following these instructions. Make sure to sign-up (requires a credit card) but, don't worry, we'll deploy AuthC using the [free tier](https://fly.io/docs/about/pricing/).

[Install Flyctl](https://fly.io/docs/hands-on/install-flyctl/)

## Step 2 - App Configuration

The Fly platform uses `fly.toml` to configure applications for deployment. Let's create one. 

In the Authcompanion directory, run the following flyctl command. It's important to be in the main directory so that the AuthC Dockerfile can be detected by flyctl.

```bash
$ cd auth2/
```

```bash
$ flyctl launch
```

Follow the prompts but remember to say `no` to setting up a postgres database and `no` to the option of deploying your app now (we'll do that shortly).

We need to make 3 additions to the `fly.toml` file (highlighted below) before we can launch the application. 

Set both the `ORIGIN` and `APPLICATION_ORIGIN` like below to match your deployment's domain name. The application_origin config tells AuthC where to redirect the user after they register or login with an account (right now its set to the AuthC default homepage). The origin configuration tells AuthC how to set the authenticator for the 'passwordless' user flow. Both are important!  

Next, set the internal_port to AuthC's default port of `3002`.

```bash{9,10,18}
# fly.toml file generated for cold-glitter-1600 on 2022-09-14T20:55:51-04:00

app = "cold-glitter-1600"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[env]
ORIGIN="http://cold-glitter-1600.fly.dev"
APPLICATION_ORIGIN="http://cold-glitter-1600.fly.dev/v1/web/home"

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

Once deployment has completed - navigate to `https://cold-glitter-1600.fly.dev/v1/web/login` and try it out (replace the dns name with yours in this example)!

::: warning Important Notes About This deployment

1. **No persistent storage** - Volumes are persistent storage for Fly apps, they allow AuthC to save its user data and the application can be restarted with that information in place. Please create a [volume](https://fly.io/docs/reference/volumes/) (the 3GB is free) to persist your users.
   
2. **No outbound email** - When a user requests to have their passwords reset, AuthC requires an SMTP connection to send that mail. In this example, we have not provided an SMTP connection to AuthC (users will not recieve a password reset email until one is provided).

3. **Custom Domain** - this example uses the fly.dev domain but, you can set your own custom domain through these [instructions](https://fly.io/blog/how-to-custom-domains-with-fly/). Make sure to change the settings in your `fly.toml` file and redeploy!
   :::

Easy right? If you have trouble - make sure [to get help](../contributing/gettinghelp.md)!