# Admin API

The RESTful Admin API helps you to manage your Authcompanion Users for administrative purposes. And can be used to power an Authcompanion Admin Panel.

## Admin Access Token (Bearer Token)

All Admin API requests require a Bearer Token in the request's header. This token is generated when you call the `admin/login` endpoint (described below). The token is a JWT (JSON Web Token) that contains the user's ID, name, email, and scope. The scope is always `admin` for the admin user.

The JWT itself has a expiration time of 2 hours. After that time, you will need to generate a new token by calling the `admin/login` endpoint again.

## Server URL

`http://localhost:3002/v1/`

Returns Content-Type: application/json

## Endpoints

### admin/login

Description: Trades the admin credentials for an admin access token used to access the Admin API. See more information about the admin credentials the administer section of the documentation at [Administer](/guide/administer.md). Only Admin tokens can access the Admin API.

**POST** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "admin@localhost",
      "password": "9ae5a568ad70f6c3ee886d72baf1e5fcec3be630"
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "01f900ba-2c5e-4e0b-84e0-12355d731de4",
    "attributes": {
      "name": "Admin",
      "email": "admin@localhost",
      "created": "2023-03-12T17:33:48.636Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIwMWY5MDBiYS0yYzVlLTRlMGItODRlMC0xMjM1NWQ3MzFkZTQiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInNjb3BlIjoiYWRtaW4iLCJpYXQiOjE2Nzg2Nzc2NzksImV4cCI6MTY3ODY4NDg3OX0.d-vycADtZehogLeYSdrs0mQ_4YhHwNBuiAS7UaD1ozs",
      "access_token_expiry": 1678684879
    }
  }
}
```

---

### admin/users

Description: Returns a list of users from the Authcompanion database.

Bearer Token Required: `Authorization: Bearer {admin access token}`

**GET**

Query Parameters:

- page[size] (optional): The number of users to include per page.
- page[number] (optional): The page number of users to retrieve.
- search[email] (optional): Filter users by email address using the LIKE operator.

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
				"metadata": {
					"tenant": "tenantID"
				},
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
				"metadata": {
					"tenant": "tenantID"
				},
        "active": 1,
        "created": "2023-02-02T21:34:37.712Z",
        "updated": "2023-02-02T21:34:37.712Z"
      }
    }
  ],
  "links": {
    "next": "/v1/admin/users?page[number]=2&page[size]=2",
    "first": "/v1/admin/users?page[number]=1&page[size]=2",
    "last": "/v1/admin/users?page[number]=3&page[size]=2"
  }
}
```

---

### admin/users

Description: Creates a new user in the Authcompanion database.

Bearer Token Required: `Authorization: Bearer {admin access token}`

Pass an arbitrary object to data.attributes.metdata which will be made available as a claim on the user's JWT issued after login. 

**POST** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "password": "supersecret",
      "metadata": {
        "tenant": "tenantID"
      },
      "active": 1,
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
      "metadata": {
        "tenant": "tenantID"
      },
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

Pass an arbitrary object to data.attributes.metdata which will be made available as a claim on the user's JWT issued after login. 

**PATCH** Request Body:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "password": "supersecret",
      "active": 1,
      "metadata": {
          "tenant": "tenantID",
        },
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
      "metadata": {
          "tenant": "tenantID",
        },
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
