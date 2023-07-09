# Configure

If you're just trying AuthC out - the default configuration will work just fine for development purposes (the `.env` config file can be optionally used when starting the server).

In production environments, extra care should be given to setting the proper server configurations. Please see the [Launch Guide](launch.md) for more information.

To set the configuration, copy the exampe file called `env.example` as a `.env` file and ensure the file is accesible to AuthCompanion where it's started. Then make your configuration changes to the new `.env` file and start/restart the server.

- You can find the env.example here (with documentation for each setting): [https://github.com/authcompanion/authcompanion2/blob/main/env.example](https://github.com/authcompanion/authcompanion2/blob/main/env.example)

- If you don't use a .env file setup, AuthC uses the default configuration located here: [https://github.com/authcompanion/authcompanion2/blob/main/config.js](https://github.com/authcompanion/authcompanion2/blob/main/config.js)
