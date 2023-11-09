# [3.0.0-beta.21](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.20...3.0.0-beta.21) (2023-11-09)

This release of AuthCompanion has two new configuration options including REGISTRATION_ORIGIN to redirect a user to a URL after registration and SAMESITE to declare if your cookie should be restricted to a first-party or same-site context. 

Also, we introduce on the /refresh endpoint the ability to invalidate the user's refresh_token as a part of logging a user out. 

### Features

* new configuration options ([#19](https://github.com/authcompanion/authcompanion2/issues/19)) ([3e07d84](https://github.com/authcompanion/authcompanion2/commit/3e07d84e513b69a217162421b8650b20020b7b03))



# [3.0.0-beta.20](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.19...3.0.0-beta.20) (2023-10-29)


### Features

This release of AuthCompanion features many improvements to the Admin API to make integrating with AuthC simpler. Additionally, newly added is the /refresh endpoint for the Admin API for refreshing your admin JWT without having to login again. 

* **admin api:** new /refresh api endpoint ([#17](https://github.com/authcompanion/authcompanion2/issues/17)) ([482ae8b](https://github.com/authcompanion/authcompanion2/commit/482ae8b919981d01be7fcef036fb3e4080d6f0e3))



# [3.0.0-beta.19](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.18...3.0.0-beta.19) (2023-10-16)

This release of AuthCompanion features the ability to set custom claims on the user's JWT including setting the value for a public claim (called `metadata`) and a private claim (called `app`). Custom claims can be set via the AuthC APIs, please see API Developer Reference documentation for examples. 

### Bug Fixes

* add metadata user field to admin api response ([7f85566](https://github.com/authcompanion/authcompanion2/commit/7f8556679604ee6427d07692b1beb76bbe5ddbf5))


### Features

* add ability to pass value to a new metadata claim ([#15](https://github.com/authcompanion/authcompanion2/issues/15)) ([e1dca1f](https://github.com/authcompanion/authcompanion2/commit/e1dca1f20c5943cc60c84ace7a7ca53e85cfca5a))
* add ability to pass value to jwt claim called app ([#16](https://github.com/authcompanion/authcompanion2/issues/16)) ([c344b1a](https://github.com/authcompanion/authcompanion2/commit/c344b1a8d62b351232f6b2be614f45cc7dd6081b))



# [3.0.0-beta.18](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.17...3.0.0-beta.18) (2023-10-05)


### Features

* admin credentials are written to file and console on authc's first start ([97dd115](https://github.com/authcompanion/authcompanion2/commit/97dd115508db5e0995eb28b6431eabb48c2f4d61))
* admin login to use admin table ([#14](https://github.com/authcompanion/authcompanion2/issues/14)) ([42f236a](https://github.com/authcompanion/authcompanion2/commit/42f236a3cede87aa40f9c6293c448ce02e6d1b86))



# [3.0.0-beta.17](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.16...3.0.0-beta.17) (2023-09-23)

This release of AuthCompanion features a new and improved UI for the Admin Dashboard! 💎

### Bug Fixes

* update admin route for new folder structure ([27ebd2d](https://github.com/authcompanion/authcompanion2/commit/27ebd2d88f12a8818da92c31dfb87a8393bb3aef))


### Features

* refresh admin dashboard ui ([#13](https://github.com/authcompanion/authcompanion2/issues/13)) ([7924501](https://github.com/authcompanion/authcompanion2/commit/7924501fb89a6d9f3b9157c0635dc39b9c511ea8))



# [3.0.0-beta.16](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.15...3.0.0-beta.16) (2023-09-15)

This release of AuthCompanion features a new and improved UI for all authentication web forms!

### Features

* **client:** new and refreshed UI for all auth pages ([#12](https://github.com/authcompanion/authcompanion2/issues/12)) ([ce3d3c3](https://github.com/authcompanion/authcompanion2/commit/ce3d3c3dc2eb4a439eaf389ead25d76d676ce167))



# [3.0.0-beta.15](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.14...3.0.0-beta.15) (2023-09-08)


### Bug Fixes

* **docs:** improvements to article grammar ([f86b1aa](https://github.com/authcompanion/authcompanion2/commit/f86b1aadea665db0e4d26f1ff2b7c38fc5d88130))
* **docs:** refreshed examples used in documenation ([fd30180](https://github.com/authcompanion/authcompanion2/commit/fd30180355836739337c78641ecdcd9460ca94e8))



# [3.0.0-beta.14](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.13...3.0.0-beta.14) (2023-06-03)

This release of AuthCompanion features an improved Admin Dashboard, which includes new search functionality for filtering by a user's email address and new pagination tools for navigating a large number of users. 

### Bug Fixes

* **admin:** conditional formatting for active/inactive accounts ([5b03a5f](https://github.com/authcompanion/authcompanion2/commit/5b03a5f3edad6d92d5cf1ccb520e3b7d07ce04d7))
* **admin:** trigger login form submit with enter key ([ed88b1d](https://github.com/authcompanion/authcompanion2/commit/ed88b1d2707c0633a729748641768fc3f0d593f9))
* **admin:** usability improvements for table rows ([7c57722](https://github.com/authcompanion/authcompanion2/commit/7c57722cfb520b11fdbbd38b802b5fb154fc643b))
* only set challenge cookie on /login routes ([cbdb515](https://github.com/authcompanion/authcompanion2/commit/cbdb5157971ff8b4a32899a4d5efe64659668cca))


### Features

* **admin:** add page size dropdown to dashboard ([1e329fa](https://github.com/authcompanion/authcompanion2/commit/1e329fa6420f229d453bfb9dbf0e436b91c45609))
* **admin:** add pagination to admin api list endpoint ([d9c73af](https://github.com/authcompanion/authcompanion2/commit/d9c73af77143dd174014890ec7c5da164a514cc7))
* **admin:** add pagination to dashboard ([f9c0a12](https://github.com/authcompanion/authcompanion2/commit/f9c0a12d2a27b2d965ec8d600cd5cff8bc593e08))
* **admin:** admin dashboard now has a search box for filtering by user email ([2548f83](https://github.com/authcompanion/authcompanion2/commit/2548f833934bc7bb61d53aa3c0bc65c5f3b3cb74))
* **admin:** filter users by email address using the LIKE operator ([79ac5f8](https://github.com/authcompanion/authcompanion2/commit/79ac5f8b52aaa472423742add94427463ae63256))



# [3.0.0-beta.13](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.12...3.0.0-beta.13) (2023-05-05)


### Bug Fixes

* added validation for webauthn POST endpoints ([250fbc1](https://github.com/authcompanion/authcompanion2/commit/250fbc1b153d9a0dd36ab321ae454f1723088b27))
* avoid GET for state change operations; auth/refresh is now POST request ([941e37d](https://github.com/authcompanion/authcompanion2/commit/941e37d0de659829eeb6a5ea67cb84babf9bdd36))
* corrected /refresh schema for validation ([e3fce6c](https://github.com/authcompanion/authcompanion2/commit/e3fce6c75437a4aad3e72166b0f404e615e6b996))
* user is set to active once finishes webauthn registration + better user record defaults ([98f5176](https://github.com/authcompanion/authcompanion2/commit/98f517689958dc2e2ecfd1f9a7dec86280256d8f))


### Features

* auto generate username field for registrations via webauthn ([4ff4775](https://github.com/authcompanion/authcompanion2/commit/4ff4775f914a473ab435c9f7bad358b4ca1f37f3))



# [3.0.0-beta.12](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.11...3.0.0-beta.12) (2023-04-29)


### Bug Fixes

* admin panel logout link bug corrected ([734d5cb](https://github.com/authcompanion/authcompanion2/commit/734d5cb78cc1f8a72997bf50b10faf3587b6388e))
* show app version in default route ([ad3e0d1](https://github.com/authcompanion/authcompanion2/commit/ad3e0d12aa97947c7d88f462a63b88996b7e4025))


### Features

* prevent token sidejacking through a new "user context" added to the JWT; as implemented in the [OWASP recommendation](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.md#token-sidejacking) ([9948b59](https://github.com/authcompanion/authcompanion2/commit/9948b59394c225d5123a58c54f1dd651b2394fdd))



# [3.0.0-beta.11](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.10...3.0.0-beta.11) (2023-03-23)


### Features

* new admin dashboard ([#10](https://github.com/authcompanion/authcompanion2/issues/10)) ([d8b4c96](https://github.com/authcompanion/authcompanion2/commit/d8b4c96688c568a8d96c41b98c770796e47e1416))

Introduces a Admin Dashboard for managing your users in AuthCompanion. It provides a range of functions that administrators can use to create, edit, and delete user accounts via a friendly and intuitive interface.

# [3.0.0-beta.10](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.9...3.0.0-beta.10) (2023-02-23)


### Bug Fixes

* corrected admin api schemas ([1c12935](https://github.com/authcompanion/authcompanion2/commit/1c129359f1800d949d5eb45cb712d6bff6667ae6))
* format error in deployment script ([d57a4af](https://github.com/authcompanion/authcompanion2/commit/d57a4af5d923625469a36a6411097c6b6b08615d))
* improved error messages on web forms ([f3ba6f7](https://github.com/authcompanion/authcompanion2/commit/f3ba6f70c81f6427a35a078fcab00522de7b4f2b))
* readable config default path for db ([a40aaa2](https://github.com/authcompanion/authcompanion2/commit/a40aaa2e2998e04425e9dbdeb4de716e3f7dc050))


### Features

* simplfied, refactored Auth API ([288f906](https://github.com/authcompanion/authcompanion2/commit/288f906114796fc7a526cefaf4ac9a8b88108658))


### BREAKING CHANGES

* Interacting with Authentication API endpoints has changed significantly: see docs for latest https://docs.authcompanion.com/guide/authapi.html.
* Config defaults in `env.example` has changed significantly. Please update your config accordingly.


# [3.0.0-beta.9](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.8...3.0.0-beta.9) (2023-02-12)


### Features

* New Admin API helps you to manage your Authcompanion Users for administrative purposes. ([#9](https://github.com/authcompanion/authcompanion2/issues/9)) ([29d7033](https://github.com/authcompanion/authcompanion2/commit/29d70330d3eed17fb941b6085e2825614236d9bc))



# [3.0.0-beta.8](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.7...3.0.0-beta.8) (2023-01-23)


### Bug Fixes

* enable WAL mode on sqlite + version bump ([b3ead8e](https://github.com/authcompanion/authcompanion2/commit/b3ead8ebf32c7d833df286b8156e00f60562eb37))
* improved graceful shutdown in containers ([df2fe0f](https://github.com/authcompanion/authcompanion2/commit/df2fe0f372d17573131960e00dce7a0de0345a09))



# [3.0.0-beta.7](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.6...3.0.0-beta.7) (2023-01-13)


### Bug Fixes

* set webauthn verification as "preferred" + SimpleWebAuthn bump to v7 ([d26b765](https://github.com/authcompanion/authcompanion2/commit/d26b7656280731e201e8a8e2386927760cb08c53))


### Features

* /refresh endpoint now has JSON Schema validation ([a64a04a](https://github.com/authcompanion/authcompanion2/commit/a64a04a4483a24cfa43d2dfe061aad17595c0192))



# [3.0.0-beta.6](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.5...3.0.0-beta.6) (2022-12-23)


### Features

* new email template for account recovery email ([7eb301e](https://github.com/authcompanion/authcompanion2/commit/7eb301ecf8beb7082a33036c21b8ff8ef8ef9c49))



# [3.0.0-beta.5](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.4...3.0.0-beta.5) (2022-12-08)


### Bug Fixes

* responsive positioning of the web forms on mobile devices ([3dafeb5](https://github.com/authcompanion/authcompanion2/commit/3dafeb51c5ff052ec8a5a8131be45ff617fd201c))


### Features

* new and improved ui styling for web forms ([1af3562](https://github.com/authcompanion/authcompanion2/commit/1af356235297cfbb62ba71e42dd334eb34c1efbc))

See screenshots of the new UI for the Webforms here: [docs.authcompanion.com/guide/webforms.html](https://docs.authcompanion.com/guide/webforms.html) or head over to the public demo at [demo.authcompanion.com/v1/web/login](https://demo.authcompanion.com/v1/web/login)


# [3.0.0-beta.4](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.3...3.0.0-beta.4) (2022-11-30)


### Bug Fixes

* enable SSL on SMTP connection and set better config defaults ([68caee7](https://github.com/authcompanion/authcompanion2/commit/68caee7f3206048950fb36faf25778d68c193ac7))
* improved config default for application origin ([83d3724](https://github.com/authcompanion/authcompanion2/commit/83d37240ef2b67bc07f05de178e40d6d3a24aa79))
* throw proper error code on error ([14b041e](https://github.com/authcompanion/authcompanion2/commit/14b041ec455b618590b94bb7af414304857dfb84))
* typo in error and log msgs ([62cc615](https://github.com/authcompanion/authcompanion2/commit/62cc615a3ce44bd903306d51bb990d95b8c084e6))


### Features

* AuthC's profile web form can now be used with the account recovery flow ([4ab917f](https://github.com/authcompanion/authcompanion2/commit/4ab917fe7ac87ad86873a98cb1d493f4afe87998))


### Documentation

* New Integrating with AuthC Guide: [https://docs.authcompanion.com/guide/integrate.html](https://docs.authcompanion.com/guide/integrate.html)
* New Launch AuthC into PROD Guide: [https://docs.authcompanion.com/guide/launch.html](https://docs.authcompanion.com/guide/launch.html)


# [3.0.0-beta.3](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.2...3.0.0-beta.3) (2022-09-15)


### Bug Fixes

* improved cookie parsing for refresh api ([6f4a996](https://github.com/authcompanion/authcompanion2/commit/6f4a996dcad0455056496fe7bc0abdbd9fb106f6))
* removed unused configs + updated env file doc ([5b4c8dd](https://github.com/authcompanion/authcompanion2/commit/5b4c8dd26c5e25ccbab22d1639eb1d7007b12a67))
* set correct origin for authenticator based on config ([174b194](https://github.com/authcompanion/authcompanion2/commit/174b194a466b0f1c61112f116439be814fdbe5c6))


### Features

* adds a default route to familiarize new users ([a3a8f7f](https://github.com/authcompanion/authcompanion2/commit/a3a8f7fd5b1812b6faae5e6ec66b974ec554dd1e))


### Reverts

* config removal and improved .env doc ([48c9dfb](https://github.com/authcompanion/authcompanion2/commit/48c9dfb55442a57cb5220c7e10d9651e7586096e))



# [3.0.0-beta.2](https://github.com/authcompanion/authcompanion2/compare/3.0.0-beta.1...3.0.0-beta.2) (2022-09-11)


### Bug Fixes

* generate and store webauthn challenge ([24dc2ab](https://github.com/authcompanion/authcompanion2/commit/24dc2ab666e6b13e69b9a6ac99b220c635da4129))



# [3.0.0-beta.1](https://github.com/authcompanion/authcompanion2/compare/2.0.0-beta.1...3.0.0-beta.1) (2022-09-09)

## Features
### Passkey Support
Passkey is WebAuthn-based flow which replaces the traditional combination of "password + second-factor" authentication method.
Using AuthC's built-in webforms users can now register and login into your application without a password. 

Passkeys are resistant to push-phishing, are unique across every website, and are generated using cryptographically secure hardware (like a mobile device).

Additionally, passkeys generated by the three main platform authenticator vendors (Apple, Google, and Microsoft) are automatically synchronized across a user's devices by their respective cloud account. That means there's finally an easy way for users to regain account access if they happen to lose or trade in their device.

# 2.0.0-beta.1 (2022-07-27)

Initial Commit
