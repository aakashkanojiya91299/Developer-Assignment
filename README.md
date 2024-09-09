**Developer Assignment API Documentation**
=====================================

**Overview**
------------

This repository contains a collection of API endpoints for a developer assignment project. The APIs are designed to handle user registration, email validation, category retrieval, login, and category selection updates.

**Endpoints**
------------

### 1. Register User

* **URL:** `https://developerassignment.vercel.app/api/trpc/register`
* **Method:** `POST`
* **Request Body:**
	+ `email`: string (required)
	+ `password`: string (required)
	+ `name`: string (required)
* **Response:** JSON object with user registration status and a verification token

### 2. Verify Email

* **URL:** `https://developerassignment.vercel.app/api/trpc/verifyEmail`
* **Method:** `POST`
* **Request Body:**
	+ `email`: string (required)
	+ `token`: string (required, obtained from registration response)
* **Response:** JSON object with email verification status and a new authentication token

### 3. Login

* **URL:** `https://developerassignment.vercel.app/api/trpc/login`
* **Method:** `POST`
* **Request Body:**
	+ `email`: string (required)
	+ `password`: string (required)
* **Response:** JSON object with login status and an authentication token (if user is verified) or a verification token (if user is not verified)

### 4. Get Categories

* **URL:** `https://developerassignment.vercel.app/api/trpc/getCategories?page=1&limit=6`
* **Method:** `GET`
* **Query Parameters:**
	+ `page`: integer (optional, default: 1)
	+ `limit`: integer (optional, default: 6)
* **Response:** JSON array of category objects

### 5. Update Selected Categories

* **URL:** `https://developerassignment.vercel.app/api/trpc/updateSelectedCategories`
* **Method:** `POST`
* **Request Body:**
	+ `categoryIds`: array of integers (required)
* **Response:** JSON object with update status

**Authorization**
--------------

Some endpoints require an `Authorization` header with a valid authentication token. The token can be obtained by logging in using the `login` endpoint or by verifying email using the `verifyEmail` endpoint.

**Workflow**
------------

1. User registers using the `register` endpoint and receives a verification token.
2. User is redirected to the email verification page.
3. User verifies their email using the `verifyEmail` endpoint and receives a new authentication token.
4. User logs in using the `login` endpoint and receives an authentication token (if user is verified) or a verification token (if user is not verified).
5. User uses the authentication token to access protected endpoints such as `getCategories` and `updateSelectedCategories`.

**Example Usage**
----------------

You can use tools like `curl` to test the APIs. Here are some examples:

```bash
# Register user
curl -X POST \
  https://developerassignment.vercel.app/api/trpc/register \
  -H 'Content-Type: application/json' \
  -d '{"email": "aakash.kanojiya@stspl.com", "password": "test@123", "name": "aashish"}'

# Verify email
curl -X POST \
  https://developerassignment.vercel.app/api/trpc/verifyEmail \
  -H 'Content-Type: application/json' \
  -d '{"email": "aakash.kanojiya@stspl.com", "token": "<verification_token>"}'

# Login
curl -X POST \
  https://developerassignment.vercel.app/api/trpc/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "aakash.kanojiya@stspl.com", "password": "test@123"}'

# Get categories
curl -X GET \
  https://developerassignment.vercel.app/api/trpc/getCategories?page=1&limit=6 \
  -H 'Authorization: <authentication_token>'

# Update selected categories
curl -X POST \
  https://developerassignment.vercel.app/api/trpc/updateSelectedCategories \
  -H 'Content-Type: application/json' \
  -H 'Authorization: <authentication_token>' \
  -d '{"categoryIds": [1, 2]}'
```

Replace `<verification_token>` and `<authentication_token>` with the actual tokens obtained from the `register` and `verifyEmail` endpoints, respectively.

## 🔗 Links
[![API](https://www.daimto.com/wp-content/uploads/2018/02/postman-logo-300x300.png)](https://documenter.getpostman.com/view/27566778/2sAXjRXVba)