# Configure

AuthCompanion uses a configuration file to help developers change the server behavior based on the environment its run in. 

If you're just trying AuthC out - the default configuration will work just fine for development (config file can be optionally used). In production environments, extra care should be given to setting the proper server configurations. 

To set the configuration, copy the exampe file called `env.example` as a `.env` file where AuthCompanion is started. Then make your configuration changes to the new `.env` file and start/restart the server. 

* You can find the env.example here (with documentation for each setting): [https://github.com/authcompanion/authcompanion2/blob/main/env.example](https://github.com/authcompanion/authcompanion2/blob/main/env.example)

* If you don't use a .env file, AuthC uses the default configuration here here: [https://github.com/authcompanion/authcompanion2/blob/main/config.js](https://github.com/authcompanion/authcompanion2/blob/main/config.js)
