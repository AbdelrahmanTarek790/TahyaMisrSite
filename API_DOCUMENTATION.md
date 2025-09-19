# Tahya Misr Students Union API Documentation

## Overview

This is the backend API for the Tahya Misr Students Union Platform. The API provides endpoints for user management, join requests, news, events, media, and notifications.

**Base URL:** `http://localhost:8080/api/v1`

## Response Format

All API responses follow this standard format:

```json
{
    "success": true,
    "data": {},
    "error": null
}
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Health Check

-   **GET** `/health` - Check if the API is running

### Authentication & Users

#### Register User

-   **POST** `/auth/register` - **DISABLED** (Accounts are now created by admins or through join requests)
-   ~~Register a new user account~~

#### Join Request

-   **POST** `/join-requests` - Submit a join request (Public access)
-   **Body:**

```json
{
    "name": "Ahmed Ali",
    "email": "ahmed@example.com",
    "phone": "0100000000",
    "nationalID": "29801010101010",
    "governorate": "Cairo",
    "position": "66a1b4c5d9f8a23e98765432",
    "membershipNumber": "TM-2025-001",
    "role": "member",
    "notes": "Optional notes"
}
```

#### Get Join Requests

-   **GET** `/join-requests` - Get all join requests (Admin only)
-   **Query Parameters:**
    -   `status` - Filter by status (pending, approved, denied)
    -   `page` - Page number (default: 1)
    -   `limit` - Items per page (default: 10)

#### Get Single Join Request

-   **GET** `/join-requests/:id` - Get a specific join request (Admin only)

#### Approve Join Request

-   **PATCH** `/join-requests/:id/approve` - Approve a join request and create user account (Admin only)
-   **Body:**

```json
{
    "notes": "Approved by admin",
    "university": "Cairo University",
    "membershipExpiry": "2026-12-31"
}
```

#### Deny Join Request

-   **PATCH** `/join-requests/:id/deny` - Deny a join request (Admin only)
-   **Body:**

```json
{
    "notes": "Reason for denial"
}
```

#### Delete Join Request

-   **DELETE** `/join-requests/:id` - Delete a join request (Admin only)

#### Login User

-   **POST** `/auth/login`
-   **Body:**

```json
{
    "email": "ahmed@example.com",
    "password": "123456"
}
```

#### Forgot Password

-   **POST** `/auth/forgot-password`
-   **Body:**

```json
{
    "email": "ahmed@example.com"
}
```

#### Reset Password

-   **POST** `/auth/reset-password`
-   **Body:**

```json
{
    "token": "reset_token_from_email",
    "password": "new_password123"
}
```

#### Change Password

-   **PUT** `/auth/change-password` (Protected)
-   **Body:**

```json
{
    "currentPassword": "current_password123",
    "newPassword": "new_password123"
}
```

#### Get Current User

-   **GET** `/users/me` (Protected)
-   Returns current user's profile

#### Update Current User

-   **PUT** `/users/me` (Protected)
-   **Body:** Same as register (optional fields)

### User Management (Admin Only)

#### Get All Users

-   **GET** `/users?page=1&limit=10` (Admin)
-   Returns paginated list of users

#### Get Single User

-   **GET** `/users/:id` (Admin)

#### Update User

-   **PUT** `/users/:id` (Admin)

#### Delete User

-   **DELETE** `/users/:id` (Admin)

### Positions

#### Get All Positions

-   **GET** `/positions?governorate=Cairo`
-   Returns positions (filtered by governorate if provided)

#### Get Single Position

-   **GET** `/positions/:id`

#### Create Position

-   **POST** `/positions` (Admin)
-   **Body:**

```json
{
    "name": "President",
    "description": "Union President",
    "isGlobal": true,
    "governorate": "Cairo"
}
```

#### Update Position

-   **PUT** `/positions/:id` (Admin)

#### Delete Position

-   **DELETE** `/positions/:id` (Admin)
-   Soft delete (sets isActive to false)

### News

#### Get All News

-   **GET** `/news?page=1&limit=10`
-   Returns paginated news list

#### Get Single News

-   **GET** `/news/:id`

#### Create News

-   **POST** `/news` (Admin)
-   **Content-Type:** `multipart/form-data`
-   **Body:**
    -   `title`: string
    -   `content`: string
    -   `image`: file (optional)

#### Update News

-   **PUT** `/news/:id` (Admin)
-   Same as create

#### Delete News

-   **DELETE** `/news/:id` (Admin)

### Events

#### Get All Events

-   **GET** `/events?page=1&limit=10`
-   Returns paginated events list

#### Get Single Event

-   **GET** `/events/:id`

#### Create Event

-   **POST** `/events` (Admin)
-   **Content-Type:** `multipart/form-data`
-   **Body:**
    -   `title`: string
    -   `description`: string
    -   `date`: date
    -   `location`: string
    -   `image`: file (optional)

#### Update Event

-   **PUT** `/events/:id` (Admin)

#### Delete Event

-   **DELETE** `/events/:id` (Admin)

#### Register for Event

-   **POST** `/events/:id/register` (Protected)
-   Register current user for an event

### Media

#### Get All Media

-   **GET** `/media?page=1&limit=10&type=photo`
-   Returns paginated media list

#### Get Single Media

-   **GET** `/media/:id`

#### Upload Media

-   **POST** `/media` (Admin)
-   **Content-Type:** `multipart/form-data`
-   **Body:**
    -   `file`: file (image or video)
    -   `caption`: string (optional)

#### Update Media

-   **PUT** `/media/:id` (Admin)
-   Only caption can be updated

#### Delete Media

-   **DELETE** `/media/:id` (Admin)

### Notifications (Admin Only)

#### Send Notification

-   **POST** `/notifications` (Admin)
-   **Body:**

```json
{
    "title": "Important Notice",
    "message": "This is an important message",
    "userIds": ["userId1", "userId2"] // optional, sends to all if not provided
}
```

#### Send Notification by Role

-   **POST** `/notifications/role` (Admin)
-   **Body:**

```json
{
    "title": "Notice for Students",
    "message": "Message for all students",
    "role": "student"
}
```

#### Send Notification by Governorate

-   **POST** `/notifications/governorate` (Admin)
-   **Body:**

```json
{
    "title": "Cairo Notice",
    "message": "Message for Cairo users",
    "governorate": "Cairo"
}
```

## Error Handling

Errors are returned in the standard format:

```json
{
    "success": false,
    "error": "Error message",
    "data": null
}
```

Common HTTP status codes:

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request
-   `401` - Unauthorized
-   `403` - Forbidden
-   `404` - Not Found
-   `500` - Internal Server Error

## File Uploads

-   Images and videos are accepted
-   Maximum file size: 5MB
-   Files are stored in `/uploads` directory
-   Accessible via: `http://localhost:5000/uploads/filename`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start MongoDB
5. Seed the database: `npm run seed`
6. Start the server: `npm run dev`

The API will be available at `http://localhost:5000/api/v1`
