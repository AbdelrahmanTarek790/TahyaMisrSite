# Achievements & Activities API Documentation

This document describes the API endpoints for managing Achievements and Activities in the Tahya Misr Youth Union platform.

---

## Table of Contents

1. [Achievements API](#achievements-api)
2. [Activities API](#activities-api)
3. [Data Models](#data-models)
4. [Authentication](#authentication)

---

## Achievements API

Base URL: `/api/v1/achievements`

### 1. Get All Achievements

**Endpoint:** `GET /api/v1/achievements`

**Access:** Public

**Query Parameters:**

-   `isActive` (optional): Filter by active status (true/false)

**Response:**

```json
{
    "success": true,
    "count": 7,
    "data": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "title": "منتدي الطريق الى الجمهوريه الجديدة",
            "description": "منصة حوارية تهدف الي الجمع بين شباب الجمهورية...",
            "highlights": ["الإستراتيجية الوطنية لحقوق الإنسان", "الأمن القومي والتنمية السياسية"],
            "color": "text-egypt-red",
            "image": "https://example.com/image.jpg",
            "icon": "Globe",
            "order": 1,
            "isActive": true,
            "createdBy": {
                "_id": "507f1f77bcf86cd799439012",
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "createdAt": "2025-01-01T00:00:00.000Z",
            "updatedAt": "2025-01-01T00:00:00.000Z"
        }
    ]
}
```

**Example Request:**

```bash
# Get all achievements
curl -X GET http://localhost:8080/api/v1/achievements

# Get only active achievements
curl -X GET http://localhost:8080/api/v1/achievements?isActive=true
```

---

### 2. Get Achievement by ID

**Endpoint:** `GET /api/v1/achievements/:id`

**Access:** Public

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "منتدي الطريق الى الجمهوريه الجديدة",
        "description": "منصة حوارية تهدف الي الجمع بين شباب الجمهورية...",
        "highlights": ["الإستراتيجية الوطنية لحقوق الإنسان"],
        "color": "text-egypt-red",
        "image": "https://example.com/image.jpg",
        "icon": "Globe",
        "order": 1,
        "isActive": true,
        "createdBy": {
            "_id": "507f1f77bcf86cd799439012",
            "name": "Admin User",
            "email": "admin@example.com"
        },
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X GET http://localhost:8080/api/v1/achievements/507f1f77bcf86cd799439011
```

---

### 3. Create Achievement

**Endpoint:** `POST /api/v1/achievements`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "title": "القمه الشبابية العربيه",
    "description": "حاضنة رئيسية لتطلعات وطموح الشباب العربي...",
    "highlights": ["تعزيز الهوية العربية", "دعم الابتكار والمعرفة"],
    "color": "text-egypt-gold",
    "image": "https://example.com/summit.jpg",
    "icon": "Crown",
    "order": 2,
    "isActive": true
}
```

**Response:**

```json
{
    "success": true,
    "message": "Achievement created successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "القمه الشبابية العربيه",
        "description": "حاضنة رئيسية لتطلعات وطموح الشباب العربي...",
        "highlights": ["تعزيز الهوية العربية", "دعم الابتكار والمعرفة"],
        "color": "text-egypt-gold",
        "image": "https://example.com/summit.jpg",
        "icon": "Crown",
        "order": 2,
        "isActive": true,
        "createdBy": "507f1f77bcf86cd799439012",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X POST http://localhost:8080/api/v1/achievements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "القمه الشبابية العربيه",
    "description": "حاضنة رئيسية لتطلعات وطموح الشباب العربي",
    "highlights": ["تعزيز الهوية العربية", "دعم الابتكار والمعرفة"],
    "color": "text-egypt-gold",
    "icon": "Crown",
    "order": 2
  }'
```

---

### 4. Update Achievement

**Endpoint:** `PUT /api/v1/achievements/:id`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "title": "القمه الشبابية العربيه - محدث",
    "description": "نسخة محدثة من الوصف...",
    "order": 3,
    "isActive": false
}
```

**Response:**

```json
{
    "success": true,
    "message": "Achievement updated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "القمه الشبابية العربيه - محدث",
        "description": "نسخة محدثة من الوصف...",
        "highlights": ["تعزيز الهوية العربية"],
        "color": "text-egypt-gold",
        "image": "https://example.com/summit.jpg",
        "icon": "Crown",
        "order": 3,
        "isActive": false,
        "createdBy": "507f1f77bcf86cd799439012",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-02T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X PUT http://localhost:8080/api/v1/achievements/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "القمه الشبابية العربيه - محدث",
    "order": 3
  }'
```

---

### 5. Delete Achievement

**Endpoint:** `DELETE /api/v1/achievements/:id`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Achievement deleted successfully",
    "data": {}
}
```

**Example Request:**

```bash
curl -X DELETE http://localhost:8080/api/v1/achievements/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Toggle Achievement Status

**Endpoint:** `PATCH /api/v1/achievements/:id/toggle`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Achievement deactivated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "القمه الشبابية العربيه",
        "isActive": false,
        "updatedAt": "2025-01-02T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X PATCH http://localhost:8080/api/v1/achievements/507f1f77bcf86cd799439013/toggle \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Reorder Achievements

**Endpoint:** `PUT /api/v1/achievements/reorder`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "achievements": [
        { "id": "507f1f77bcf86cd799439011", "order": 1 },
        { "id": "507f1f77bcf86cd799439013", "order": 2 },
        { "id": "507f1f77bcf86cd799439014", "order": 3 }
    ]
}
```

**Response:**

```json
{
    "success": true,
    "message": "Achievements reordered successfully"
}
```

**Example Request:**

```bash
curl -X PUT http://localhost:8080/api/v1/achievements/reorder \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "achievements": [
      { "id": "507f1f77bcf86cd799439011", "order": 1 },
      { "id": "507f1f77bcf86cd799439013", "order": 2 }
    ]
  }'
```

---

## Activities API

Base URL: `/api/v1/activities`

### 1. Get All Activities

**Endpoint:** `GET /api/v1/activities`

**Access:** Public

**Query Parameters:**

-   `isActive` (optional): Filter by active status (true/false)

**Response:**

```json
{
    "success": true,
    "count": 4,
    "data": [
        {
            "_id": "507f1f77bcf86cd799439021",
            "title": "اتحاد طلاب مدارس تحيا مصر",
            "image": "https://example.com/students.jpg",
            "color": "bg-gradient-to-br from-egypt-red to-red-600",
            "order": 1,
            "isActive": true,
            "createdBy": {
                "_id": "507f1f77bcf86cd799439012",
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "createdAt": "2025-01-01T00:00:00.000Z",
            "updatedAt": "2025-01-01T00:00:00.000Z"
        }
    ]
}
```

**Example Request:**

```bash
# Get all activities
curl -X GET http://localhost:8080/api/v1/activities

# Get only active activities
curl -X GET http://localhost:8080/api/v1/activities?isActive=true
```

---

### 2. Get Activity by ID

**Endpoint:** `GET /api/v1/activities/:id`

**Access:** Public

**Response:**

```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439021",
        "title": "اتحاد طلاب مدارس تحيا مصر",
        "image": "https://example.com/students.jpg",
        "color": "bg-gradient-to-br from-egypt-red to-red-600",
        "order": 1,
        "isActive": true,
        "createdBy": {
            "_id": "507f1f77bcf86cd799439012",
            "name": "Admin User",
            "email": "admin@example.com"
        },
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X GET http://localhost:8080/api/v1/activities/507f1f77bcf86cd799439021
```

---

### 3. Create Activity

**Endpoint:** `POST /api/v1/activities`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "title": "راديو تحيا مصر",
    "image": "https://example.com/radio.jpg",
    "color": "bg-gradient-to-br from-purple-500 to-purple-600",
    "order": 2,
    "isActive": true
}
```

**Response:**

```json
{
    "success": true,
    "message": "Activity created successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439022",
        "title": "راديو تحيا مصر",
        "image": "https://example.com/radio.jpg",
        "color": "bg-gradient-to-br from-purple-500 to-purple-600",
        "order": 2,
        "isActive": true,
        "createdBy": "507f1f77bcf86cd799439012",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X POST http://localhost:8080/api/v1/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "راديو تحيا مصر",
    "image": "https://example.com/radio.jpg",
    "color": "bg-gradient-to-br from-purple-500 to-purple-600",
    "order": 2
  }'
```

---

### 4. Update Activity

**Endpoint:** `PUT /api/v1/activities/:id`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "title": "راديو تحيا مصر - محدث",
    "order": 3,
    "isActive": false
}
```

**Response:**

```json
{
    "success": true,
    "message": "Activity updated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439022",
        "title": "راديو تحيا مصر - محدث",
        "image": "https://example.com/radio.jpg",
        "color": "bg-gradient-to-br from-purple-500 to-purple-600",
        "order": 3,
        "isActive": false,
        "createdBy": "507f1f77bcf86cd799439012",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-02T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X PUT http://localhost:8080/api/v1/activities/507f1f77bcf86cd799439022 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "راديو تحيا مصر - محدث",
    "order": 3
  }'
```

---

### 5. Delete Activity

**Endpoint:** `DELETE /api/v1/activities/:id`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Activity deleted successfully",
    "data": {}
}
```

**Example Request:**

```bash
curl -X DELETE http://localhost:8080/api/v1/activities/507f1f77bcf86cd799439022 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. Toggle Activity Status

**Endpoint:** `PATCH /api/v1/activities/:id/toggle`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
    "success": true,
    "message": "Activity deactivated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439022",
        "title": "راديو تحيا مصر",
        "isActive": false,
        "updatedAt": "2025-01-02T00:00:00.000Z"
    }
}
```

**Example Request:**

```bash
curl -X PATCH http://localhost:8080/api/v1/activities/507f1f77bcf86cd799439022/toggle \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Reorder Activities

**Endpoint:** `PUT /api/v1/activities/reorder`

**Access:** Private (Admin only)

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
    "activities": [
        { "id": "507f1f77bcf86cd799439021", "order": 1 },
        { "id": "507f1f77bcf86cd799439022", "order": 2 },
        { "id": "507f1f77bcf86cd799439023", "order": 3 }
    ]
}
```

**Response:**

```json
{
    "success": true,
    "message": "Activities reordered successfully"
}
```

**Example Request:**

```bash
curl -X PUT http://localhost:8080/api/v1/activities/reorder \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "activities": [
      { "id": "507f1f77bcf86cd799439021", "order": 1 },
      { "id": "507f1f77bcf86cd799439022", "order": 2 }
    ]
  }'
```

---

## Data Models

### Achievement Model

```javascript
{
  title: String (required),
  description: String (required),
  highlights: [String] (default: []),
  color: String (default: "text-egypt-gold"),
  image: String,
  icon: String (default: "Award"),
  order: Number (default: 0),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

**Available Icons:**

-   Globe
-   Crown
-   BookOpen
-   Users
-   Award
-   Heart
-   Shield

---

### Activity Model

```javascript
{
  title: String (required),
  image: String,
  color: String (default: "bg-gradient-to-br from-egypt-red to-egypt-gold"),
  order: Number (default: 0),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication

All protected endpoints (POST, PUT, DELETE, PATCH) require admin authentication.

**How to authenticate:**

1. Login to get token:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "yourpassword"
  }'
```

2. Use the token in protected requests:

```bash
curl -X POST http://localhost:8080/api/v1/achievements \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## Error Responses

### 400 Bad Request

```json
{
    "success": false,
    "message": "Title and description are required"
}
```

### 401 Unauthorized

```json
{
    "success": false,
    "message": "Not authorized to access this route"
}
```

### 404 Not Found

```json
{
    "success": false,
    "message": "Achievement not found"
}
```

### 500 Internal Server Error

```json
{
    "success": false,
    "message": "Failed to create achievement",
    "error": "Error details here"
}
```

---

## Integration Example (Frontend)

### Fetch All Achievements

```javascript
import axios from "axios"

const fetchAchievements = async () => {
    try {
        const response = await axios.get("/api/v1/achievements?isActive=true")
        console.log(response.data.data)
    } catch (error) {
        console.error("Error fetching achievements:", error)
    }
}
```

### Create Achievement (Admin)

```javascript
import axios from "axios"

const createAchievement = async (achievementData, token) => {
    try {
        const response = await axios.post("/api/v1/achievements", achievementData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        console.log("Achievement created:", response.data.data)
    } catch (error) {
        console.error("Error creating achievement:", error)
    }
}
```

---

## Summary

### Achievements Endpoints

-   ✅ `GET /api/v1/achievements` - Get all achievements
-   ✅ `GET /api/v1/achievements/:id` - Get achievement by ID
-   ✅ `POST /api/v1/achievements` - Create achievement (Admin)
-   ✅ `PUT /api/v1/achievements/:id` - Update achievement (Admin)
-   ✅ `DELETE /api/v1/achievements/:id` - Delete achievement (Admin)
-   ✅ `PATCH /api/v1/achievements/:id/toggle` - Toggle status (Admin)
-   ✅ `PUT /api/v1/achievements/reorder` - Reorder achievements (Admin)

### Activities Endpoints

-   ✅ `GET /api/v1/activities` - Get all activities
-   ✅ `GET /api/v1/activities/:id` - Get activity by ID
-   ✅ `POST /api/v1/activities` - Create activity (Admin)
-   ✅ `PUT /api/v1/activities/:id` - Update activity (Admin)
-   ✅ `DELETE /api/v1/activities/:id` - Delete activity (Admin)
-   ✅ `PATCH /api/v1/activities/:id/toggle` - Toggle status (Admin)
-   ✅ `PUT /api/v1/activities/reorder` - Reorder activities (Admin)

---

**Total: 14 API Endpoints** (7 for Achievements + 7 for Activities)
