# Getting Started

## From Source

### Requirements

- **Node.js v22+** – [Download](https://nodejs.org)
- **Git** – [Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- **Docker** (optional) – [Guide](https://docs.docker.com/get-docker/)

Start by downloading the source code or use git, to clone the repository from
Github.

```bash
$ git clone https://github.com/authcompanion/authcompanion2.git
```

Change the current working directory to authcompanion2.

```bash
$ cd authcompanion2/
```

Let's install the application's packages.

```bash
$ npm install
```

When you're ready, start the server (with the default settings). AuthC's default settings are great for trying out the server.

```bash
$ npm run start
```

When the server is properly configured and running there are two main entries
into AuthCompanion.

🖥️ The web forms, available to your application users. The login starts here:
`http://localhost:3002/login`.

Or check out the registration page here: `http://localhost:3002/register`

🚀 To interact directly your user accounts as an administrator - check out the Admin Dashboard here:
`http://localhost:3002/admin/login`

If you'd like to change the default settings, copy the example config file like
below. Take a look through the values in the .env file and make changes as
necessary.

```bash
$ cp env.example .env
```

Then restart the server to apply your new settings.

## Docker Setup

Make sure to have the
[respository cloned](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
as outlined in the steps above.

Then from the main directory, build the AuthC server image:

```bash
$ docker build -t authc_server .
```

Start the server with (default config):

```bash
$ docker run --name authcompanion \
 -p 3002:3002 \
authc_server
```

The app will be live at `http://localhost:3002/login`.

Optionally, If you have your own configuration file you can pass it into your docker command
with:

```bash
docker run --name authcompanion -p 3002:3002 --env-file .env authc_server
```

### AuthC Container Image

Container images are published for both the main branch and for the latest tagged version.

Please see the container registry [here](https://github.com/authcompanion/authcompanion2/pkgs/container/authcompanion2)

Start the server (with the default config):

```bash
$ docker run -it -p 3002:3002 --name AuthCompanion ghcr.io/authcompanion/authcompanion2:main
```

### Docker Compose

Also available is the [docker-compose.yml](https://github.com/authcompanion/authcompanion2/blob/main/docker-compose.yml)

```bash
docker compose up -d
```
