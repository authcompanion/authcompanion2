# Configure

AuthCompanion uses a configuration file - this config plays an important
function in setting up the server for production environments. If you're just
trying AuthC out - the default configuration will work just fine for development
(config file is optionally used).

To set the configuration, copy the exampe file as a `.env` file with your
settings.

| Config Name                                                          | Description                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                                                                 | The AuthC application will start listening for requests on this port                                                                                                                                                                                                                |
| ORIGIN                                                               | [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is a HTTP-header based mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources. Use this if the API and UI are hosted from different servers. |
| SECURE                                                               | A cookie with [secure attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies) is only sent to the AuthC server over HTTPS, helpful config for production environments                                                                      |
| RECOVERY_REDIRECT_URL                                                | When AuthC sends a recovery email, this is the redirect URL which brings the user back into your application to recover their account                                                                                                                                               |
| DB_PATH                                                              | The location of the SQLite database - AuthC will create one if it does not exist.                                                                                                                                                                                                   |
| KEY_PATH                                                             | The private key used to generate JWT tokens - the most important config.                                                                                                                                                                                                            |
| WEB_MODE                                                             | Turns off/on the Web Forms to only use the APIs                                                                                                                                                                                                                                     |
| APPLICATION_ORIGIN                                                   | When a user authenticates successfully, this is the URL (your application home page) to redirect the user to.                                                                                                                                                                       |
| SMTP_HOSTNAME, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, FROM_ADDRESS | SMTP settings for all outbound mail                                                                                                                                                                                                                                                 |

## The .env File

```code
######################## NOTE #########################
#*   This file describes the default AUTHC settings  *#
#*        Copy this file to a new file called .env   *#
#######################################################

################## General Settings ###################
## Port that AUTHC will listen on
PORT=3002

## Cross-Origin Resource Sharing (CORS) Settings
ORIGIN=http://localhost:3002

## A cookie with the Secure attribute is only sent to the server with an encrypted request over the HTTPS protocol.
## IMPORTANT: change to true before going into production
SECURE=false

## URL used in recovery email to redirect user back to UI for updating their password
## Must be the full URL path
RECOVERY_REDIRECT_URL=/v1/web/home

#------------------- DB Settings ---------------------#
## DB URI or path to SQLite file
DB_PATH=./authcompanion_users.db

#------------------- JWT Secrets -------------------ß--#
## Path to the key used to sign and verify JWTs used for access
KEY_PATH=./keyfile

#------------------- Web Mode ---------------------#
## Use AuthC in Web Mode which makes available UIs for Login, Registration,
## Account Recovery, and Profile
## If false, only the AuthC server APIs are available
WEB_MODE=true
## After a successful login, register profile update, redirect the user to your main
## application using the supplied URL below. Can be relative URL.
APPLICATION_ORIGIN=http://localhost:3002/v1/web/home

#------------------- SMTP Options --------------------#
## SMTP settings for outbound mail generated by Authc
SMTP_HOSTNAME=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
FROM_ADDRESS=
```
