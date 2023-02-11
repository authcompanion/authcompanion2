# Admin API

The RESTful Admin API helps you to manage your Authcompanion Users for administrative purposes. And can be used to power an Authcompanion Admin Panel.

## Bearer Token (Admin Access Token)
All Admin API requests require a Bearer Token. This token is generated when you start the AuthComanion server and is available as a file on the path set in the `ADMIN_KEY_PATH=./adminkey` config via `.env.example`.

The JWT itself has a expiration time of 1 hour. After that time, you will need to restart the AuthCompanion server to generate a new token - available in the same file.

## Server URL

http://localhost:3002/v1/

Returns Content-Type: application/json

## Endpoints

### admin/users

Description: Returns a list of users from the Authcompanion database.

Bearer Token Required: `Authorization: Bearer {admin access token}`

**GET**

Response:

```json
{
  "data": [
    {
      "type": "users",
      "id": "abf488a9-9627-4c95-9170-dcfe2ce6b4bf",
      "attributes": {
        "name": "Authy Person",
        "email": "Hello@authcompanion.com",
        "active": 1,
        "created": "2023-02-02T21:33:53.926Z",
        "updated": "2023-02-02T21:33:53.926Z"
      }
    },
    {
      "type": "users",
      "id": "2ca7c207-f945-4aba-9a30-f106ff42cd22",
      "attributes": {
        "name": "Authy Person 2",
        "email": "Hello2@authcompanion.com",
        "active": 1,
        "created": "2023-02-02T21:34:37.712Z",
        "updated": "2023-02-02T21:34:37.712Z"
      }
    }
  ]
}
```

---

### admin/users

Description: Creates a new user in the Authcompanion database.

Bearer Token Required: `Authorization: Bearer {admin access token}`

**POST** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "password": "supersecret"
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "abf488a9-9627-4c95-9170-dcfe2ce6b4bf",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "active": 1,
      "created": "2023-02-02T21:33:53.926Z",
      "updated": "2023-02-02T21:33:53.926Z"
    }
  }
}
```

---

### admin/users/:id

Description: Updates a single user from the Authcompanion database with the user's ID. If a request does not include all of the attributes for a resource, the AuthCompanion interpret the missing attributes as if they were included with their current values. Authcompanion does not interpret missing attributes as null values.

Bearer Token Required: `Authorization: Bearer {admin access token}`

**PATCH** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "password": "supersecret"
      "active": 1
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "abf488a9-9627-4c95-9170-dcfe2ce6b4bf",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "active": 1,
      "created": "2023-02-02T21:33:53.926Z",
      "updated": "2023-02-02T21:33:53.926Z"
    }
  }
}
```

---

### admin/users/:id

Description: Deletes a single user from the Authcompanion database using the user's ID. **This is a permanent delete.**

Bearer Token Required: `Authorization: Bearer {admin access token}`

**DELETE**

Response: 204 No Content 

or 404 Not Found if no user is found.

---
