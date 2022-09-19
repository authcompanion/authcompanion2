# Welcome to the Docs

<p align="center">
  <a href="https://github.com/authcompanion/authcompanion2" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/VjsHEC9.png" alt="Project logo"></a>
</p>

<h2 align="center"><b>AuthCompanion 2</b></h2>

<p align="center"> An effortless, token-based user management server - well suited for modern web projects.
</p>

<div align="center">

<a href="">
     <img alt="Active" src="https://img.shields.io/badge/status-needs%20early%20adopter%20feedback-orange?">
   </a>
   <a href="https://github.com/authcompanion/authcompanion2/stargazers">
     <img alt="GitHub stars" src="https://img.shields.io/github/stars/authcompanion/authcompanion2">
   </a>
   <a href="https://nodejs.org/en/">
     <img src="https://img.shields.io/badge/node-v18.5.0-green?logo=node.js"/>
   </a>

</div>
<br />

---

## Introduction

AuthCompanion aims to satisfy the most common authentication and user management needs for your web application.

With AuthC you can:

- Securely handle the registration, login, logout, and account recovery of your web applicaiton's user accounts.
- Generate and validate [JWTs](https://jwt.io/introduction), a token used for your user's session and authenticating them into your application's backend APIs
- Confidently store and own your web application's user accounts
- Support your users with registering and logining in with a passkey on their mobile device (passwordless) or with traditional username/passwords

---

## Features

- **Web Forms for User Authentication:** Use pre-built and customizable web
      forms for your application users to: log in with their credentials,
      register an account, update their profile, and issue forgotten passwords.

- **Manage User Profiles and JWTs:** Update the password and profile
      information of your users - all account information is stored in a SQLite
      database. Easily manage the life-cycle of your user's JWT used for
      authentication.

- **User Account Recovery:** Restore a user's access to their account using
      the **Forgot Password** flow which sends a special link via email for
      helping users quickly recover their account.

- **Extensible Platform:** AuthC supports a
      [plugin system](https://www.fastify.io/docs/latest/Reference/Plugins/) for
      easily adding new functionality to cover more of your authentication needs.

- **Passwordless Flow:** Streamline user Login and Registration without passwords with a user's computer or mobile phone with passkey.

Take AuthCompanion, the useful sidekick, into your next web project! 👏
