# Mustache Backend API

A Node.js backend API for the Mustache social networking app for men.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Complete user profiles with privacy settings and preferences
- **Friend System**: Send, accept, reject, and manage friend requests
- **Real-time Messaging**: WebSocket-based chat system with Socket.IO
- **Discovery Engine**: Find potential friends based on preferences and interests
- **Privacy Controls**: Granular privacy settings for user profiles
- **File Upload**: Support for profile photos and media sharing

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Validation**: Express-validator
- **Security**: bcryptjs for password hashing
- **File Handling**: Multer for file uploads

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── middleware/      # Custom middleware
│   └── index.ts         # Main server file
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── env.example          # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/privacy` - Update privacy settings
- `PUT /api/users/preferences` - Update user preferences
- `POST /api/users/photos` - Add profile photo
- `DELETE /api/users/photos/:photoIndex` - Remove profile photo
- `GET /api/users/:id` - Get public user profile

### Friends
- `GET /api/friends` - Get friends list
- `GET /api/friends/requests` - Get incoming friend requests
- `GET /api/friends/sent` - Get sent friend requests
- `POST /api/friends/request/:userId` - Send friend request
- `POST /api/friends/accept/:userId` - Accept friend request
- `POST /api/friends/reject/:userId` - Reject friend request
- `DELETE /api/friends/:userId` - Remove friend
- `POST /api/friends/cancel/:userId` - Cancel sent request
- `POST /api/friends/block/:userId` - Block user
- `POST /api/friends/unblock/:userId` - Unblock user

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark message as read
- `DELETE /api/messages/:messageId` - Delete message
- `GET /api/messages/unread/count` - Get unread count

### Discovery
- `GET /api/discover` - Discover potential friends
- `GET /api/discover/search` - Search for users
- `GET /api/discover/recommendations` - Get personalized recommendations

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Models

### User Model
- Personal information (name, email, date of birth)
- Profile details (bio, location, interests, photos)
- Privacy settings and preferences
- Friend relationships and requests
- Blocked users list

### Message Model
- Sender and recipient information
- Message content and type
- Read status and timestamps
- Conversation grouping

## 🌐 WebSocket Events

### Client to Server
- `join_room` - Join a conversation room
- `leave_room` - Leave a conversation room

### Server to Client
- `new_message` - New message received
- `message_deleted` - Message deleted notification

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token validation
- Input validation and sanitization
- CORS configuration
- Rate limiting support
- Privacy controls for user profiles

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:8080 |

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "errors": [] // Validation errors if applicable
}
```

## 🔧 Configuration

### MongoDB Connection
The app connects to MongoDB Atlas using the connection string from environment variables.

### CORS
Configured to allow requests from the frontend application (default: http://localhost:8080).

### File Uploads
Configured to handle profile photos and media files with size limits and type validation.

## 🚀 Deployment

1. Set `NODE_ENV=production` in environment variables
2. Ensure MongoDB Atlas is accessible from your deployment environment
3. Set appropriate CORS origins for production
4. Use a process manager like PM2 for production deployment
5. Set up proper logging and monitoring



## 📄 License

This project is part of the Mustache social networking application.

