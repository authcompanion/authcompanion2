# Admin API

The RESTful Admin API helps you to programatically manage your Authcompanion Users for administrative purposes.
The Admin APIs power AuthCompanions self-service Admin Dashboard.

## Admin Access Token (Bearer Token)

All Admin API requests require a Bearer Token in the request's header. This token is generated when you call the `admin/login` endpoint (described below) and allows access to the Admin APIs.

## Server URL

`http://localhost:3002/v1/`

Returns Content-Type: application/json

## Endpoints

### admin/login

Description: Trades the admin credentials for an admin access token used to access the various Admin API endpoints. See more information about the admin credentials in the administer section of the documentation at [Administer](/guide/administer.md).

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
    "id": "wz5dcto2bj5oeod67ehj3tvl",
    "attributes": {
      "name": "Admin",
      "email": "admin@localhost",
      "created": "2023-10-12T16:10:17.709Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ3ejVkY3RvMmJqNW9lb2Q2N2VoajN0dmwiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInVzZXJGaW5nZXJwcmludCI6IiRhcmdvbjJpZCR2PTE5JG09NjQwMDAsdD0zLHA9MSRpWlpOT2MwbitJUzhnUUwxYjJ2Wld3JEJyZERpazlZR0VOTjdqZEt3ckRnMGxzRXMrVnY0OWt3c0pKOVQrTHBxSHMiLCJzY29wZSI6ImFkbWluIiwiaWF0IjoxNjk4MDIzODA3LCJleHAiOjE2OTgwMjc0MDd9.pGVrJc8rrFFyMsaE9ubUoXl_3vfNOXTs6x6q8N6ETCU",
      "access_token_expiry": 1698027407,
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ3ejVkY3RvMmJqNW9lb2Q2N2VoajN0dmwiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInVzZXJGaW5nZXJwcmludCI6bnVsbCwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTY5ODAyMzgwNywiZXhwIjoxNjk4NjI4NjA3LCJqdGkiOiI2YTkxOGQ5NC1jNGVmLTRjOWItODFkMy05Yjg1OGFiOWU3YWEifQ.720K2t94iC_dTwGCd2IFV1WpHY9Jsmg_iK2hh2wj5h4"
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
      "id": "wz5dcto2bj5oeod67ehj3tvl",
      "attributes": {
        "name": "Authy Person",
        "email": "Hello@authcompanion.com",
        "metadata": {
          "company": "Auth Co"
        },
        "app": {
          "tenantID": "1234"
        },
        "active": 1,
        "created": "2023-02-02T21:33:53.926Z",
        "updated": "2023-02-02T21:33:53.926Z"
      }
    },
    {
      "type": "users",
      "id": "wz5dcto2bj5oeod67ehj3tvl",
      "attributes": {
        "name": "Authy Person 2",
        "email": "Hello2@authcompanion.com",
        "metadata": {
          "company": "Auth Co"
        },
        "app": {
          "tenantID": "5678"
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

Optional: Pass an arbitrary object to data.attributes.metadata which will be made available as a claim on the user's JWT issued after login, this claim is changable using the user token. Pass an arbitrary object to data.attributes.app which will be made available as a claim on the user's JWT issued after login, this claim is changable only using the admin token (aka a "private" claim).

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
        "company": "Auth Co"
      },
      "app": {
        "tenantID": "1234"
      },
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
    "id": "wz5dcto2bj5oeod67ehj3tvl",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "metadata": {
        "company": "Auth Co"
      },
      "app": {
        "tenantID": "1234"
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

Optional: Pass an arbitrary object to data.attributes.metadata which will be made available as a claim on the user's JWT issued after login, this claim is changable using the user token. Pass an arbitrary object to data.attributes.app which will be made available as a claim on the user's JWT issued after login, this claim is changable only using the admin token (aka a "private" claim).

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
        "tenant": "tenantID"
      },
      "app": {
        "tenantID": "1234"
      }
    }
  }
}
```

Response:

```json
{
  "data": {
    "type": "users",
    "id": "wz5dcto2bj5oeod67ehj3tvl",
    "attributes": {
      "name": "Authy Person",
      "email": "hello@authcompanion.com",
      "metadata": {
        "tenant": "tenantID"
      },
      "app": {
        "tenantID": "1234"
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

### admin/refresh

Description: Your admin user's access token (JWTs) will expire according the exp date. When it does, you can refresh the access token without having to login your admin user again.

If the request has a valid refresh token AuthCompanion will return a new access token and a new refresh token.

Bearer Token Required: `Authorization: Bearer {admin access token}`

**POST** Request Body:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ3ejVkY3RvMmJqNW9lb2Q2N2VoajN0dmwiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInVzZXJGaW5nZXJwcmludCI6bnVsbCwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTY5Nzk5MTYyNiwiZXhwIjoxNjk4NTk2NDI2LCJqdGkiOiI0YjVjNmU1Ni1jMzA1LTQ3ZjQtYjEyNC01YzgwMGFjY2Y2YTgifQ.q4U0smkirdBKdsUBQMcszuqg4IXIpM49lHzdE6WEeLE"
}
```

Response:

```json
{
  "data": {
    "id": "wz5dcto2bj5oeod67ehj3tvl",
    "type": "users",
    "attributes": {
      "name": "Admin",
      "email": "admin@localhost",
      "created": "2023-10-12T16:10:17.709Z",
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ3ejVkY3RvMmJqNW9lb2Q2N2VoajN0dmwiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInVzZXJGaW5nZXJwcmludCI6IiRhcmdvbjJpZCR2PTE5JG09NjQwMDAsdD0zLHA9MSQ2ZXV6U2xEbkQ1NmpJb3BkVVNHZ0RBJEZFZ1VRWm9WckJDLytpSmV6ZHlxR2FVelFDTXIyUEhmbmg0TkdIL3lOYTAiLCJzY29wZSI6ImFkbWluIiwiaWF0IjoxNjk3OTkxNjYxLCJleHAiOjE2OTc5OTUyNjF9.-EiyNfFFeHKpUCyEZZXvVcQ1vxqO-D34NWfS3HKF3jU",
      "access_token_expiry": 1697995261,
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ3ejVkY3RvMmJqNW9lb2Q2N2VoajN0dmwiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInVzZXJGaW5nZXJwcmludCI6bnVsbCwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTY5Nzk5MTY2MSwiZXhwIjoxNjk4NTk2NDYxLCJqdGkiOiJiMTY3ODEzOS0yNGY0LTQ0YjctOTE0MC05NThlNDY0NjIyZWIifQ.v3QweztMbJLINqh9iWUahyUnOPC1EqefmEbc_IuK-Zk"
    }
  }
}
```

Description: This endpoint revokes/invalidates the user's Refresh token, preventing the token from being used to refresh a session.

**DELETE** Request Body:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ3ejVkY3RvMmJqNW9lb2Q2N2VoajN0dmwiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdCIsInVzZXJGaW5nZXJwcmludCI6bnVsbCwic2NvcGUiOiJhZG1pbiIsImlhdCI6MTY5Nzk5MTYyNiwiZXhwIjoxNjk4NTk2NDI2LCJqdGkiOiI0YjVjNmU1Ni1jMzA1LTQ3ZjQtYjEyNC01YzgwMGFjY2Y2YTgifQ.q4U0smkirdBKdsUBQMcszuqg4IXIpM49lHzdE6WEeLE"
}
```

Response:

```
204 (No Content)
```

---
