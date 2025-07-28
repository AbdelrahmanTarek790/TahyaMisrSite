# Tahya Misr Students Union - Backend API

A comprehensive backend API for the Tahya Misr Students Union Platform, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Role-Based Access Control**: Admin, Volunteer, and Student roles
- **Position Management**: Dynamic positions with governorate filtering
- **News System**: CRUD operations with image upload
- **Events System**: Event management with user registration
- **Media Gallery**: Photo and video uploads with captions
- **Push Notifications**: Firebase-based notifications
- **File Uploads**: Image and video upload support
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: Centralized error handling middleware

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Push Notifications**: Firebase Admin SDK
- **Validation**: Joi
- **Security**: Helmet, CORS, bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Firebase project (for push notifications)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AbdelrahmanTarek790/TahyaMisrSite.git
cd TahyaMisrSite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tahya_misr_db

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d

# Firebase Configuration (for push notifications)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Start MongoDB

Make sure MongoDB is running on your system.

### 5. Seed the Database (Optional)

```bash
npm run seed
```

This creates sample data including an admin user:
- **Email**: admin@tahyamisr.org
- **Password**: admin123

### 6. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /health
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### User Management
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get user by ID (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Positions
- `GET /positions` - Get all positions
- `GET /positions/:id` - Get position by ID
- `POST /positions` - Create position (Admin only)
- `PUT /positions/:id` - Update position (Admin only)
- `DELETE /positions/:id` - Delete position (Admin only)

### News
- `GET /news` - Get all news (paginated)
- `GET /news/:id` - Get news by ID
- `POST /news` - Create news with image (Admin only)
- `PUT /news/:id` - Update news (Admin only)
- `DELETE /news/:id` - Delete news (Admin only)

### Events
- `GET /events` - Get all events (paginated)
- `GET /events/:id` - Get event by ID
- `POST /events` - Create event with image (Admin only)
- `PUT /events/:id` - Update event (Admin only)
- `DELETE /events/:id` - Delete event (Admin only)
- `POST /events/:id/register` - Register for event

### Media
- `GET /media` - Get all media (paginated)
- `GET /media/:id` - Get media by ID
- `POST /media` - Upload media (Admin only)
- `PUT /media/:id` - Update media caption (Admin only)
- `DELETE /media/:id` - Delete media (Admin only)

### Notifications
- `POST /notifications` - Send push notification (Admin only)
- `POST /notifications/role` - Send notification by role (Admin only)
- `POST /notifications/governorate` - Send notification by governorate (Admin only)

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📂 Project Structure

```
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── positionController.js # Position management
│   ├── newsController.js    # News management
│   ├── eventController.js   # Event management
│   ├── mediaController.js   # Media management
│   └── notificationController.js # Notifications
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── error.js            # Error handling middleware
├── models/
│   ├── User.js             # User schema
│   ├── Position.js         # Position schema
│   ├── News.js             # News schema
│   ├── Event.js            # Event schema
│   └── Media.js            # Media schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User routes
│   ├── positions.js        # Position routes
│   ├── news.js             # News routes
│   ├── events.js           # Event routes
│   ├── media.js            # Media routes
│   └── notifications.js    # Notification routes
├── utils/
│   ├── upload.js           # File upload configuration
│   ├── validation.js       # Input validation schemas
│   └── firebase.js         # Firebase utilities
├── uploads/                # File upload directory
├── .env.example           # Environment variables template
├── seed.js                # Database seeding script
└── server.js              # Main server file
```

## 🎯 Key Features

### User Roles
- **Student**: Basic member access
- **Volunteer**: Enhanced member access
- **Admin**: Full system access

### Position System
- **Global Positions**: Available in all governorates
- **Local Positions**: Tied to specific governorates

### File Upload
- Support for images and videos
- Automatic file validation
- Secure file storage

### Notification System
- Firebase push notifications
- Role-based targeting
- Governorate-based targeting
- Individual user targeting

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- File upload security
- CORS and Helmet security headers

## 🧪 Testing

Test the API endpoints using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example curl command:
```bash
curl -X GET http://localhost:5000/health
```

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the Tahya Misr Students Union development team.

---

**Built with ❤️ for the Tahya Misr Students Union**