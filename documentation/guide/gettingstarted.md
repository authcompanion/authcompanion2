# Getting Started

## From Source

Start by downloading the source code or use git, to clone the repository from
Github.

```bash
$ git clone https://github.com/authcompanion/authcompanion2.git
```

Change the current working directory to authcompanion2.

```bash
$ cd authcompanion2/
```

Pre-requirement:

- Make sure you have [Node.js](http://nodejs.org) installed **version 16+**

Let's install the application's packages

```bash
$ npm install
```

When you're ready, start the server with the default settings.

```bash
$ npm run start
```

If you'd like to change the default settings, copy the example config file like
below. Take a look through the values in the .env file and make changes as
necessary; if you have questions please see
[configuring documentation](configuration.md)

```bash
$ cp env.example .env
```

Then restart the server with your new settings. 

AuthC's default settings are great for getting started and trying things out.

## With Docker

Make sure to have the
[respository cloned](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
as outlined in the steps above. Then from the main directory, build the AuthC
server image:

```bash
$ docker build -t authc_server .
```

Start the server with (default config):

```bash
$ docker run --name authcompanion \
 -p 3002:3002 \
authc_server
```

If you have your own configuration file you can pass it into your docker command
with: `--env-file .env \`

## Using AuthCompanion

When the server is properly configured and running there are two main entries
into AuthCompanion.

🖥️ The web forms, available to your application users. The login starts here:
`http://localhost:3002/v1/web/login`.

🚀 To interact directly with with the backend APIs you start at this endpoint to
register a user:
`http://localhost:3002/v1/auth/register`
