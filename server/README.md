# CollabHub - Real-time Collaboration Platform

A Node.js/Express application with Socket.io for real-time communication and Google OAuth for secure authentication.

## 🚀 Features

- **Google OAuth 2.0 Authentication** - Secure user login with Google accounts
- **JWT Token-based Sessions** - Stateless authentication with JWT tokens
- **Socket.io Real-time Communication** - Live messaging and room-based collaboration
- **User Management** - Profile management and user listings
- **Room-based Messaging** - Join rooms and communicate with other users
- **Private Messaging** - Send private messages to specific users
- **Authenticated Socket Connections** - Only authenticated users can connect to Socket.io

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google OAuth credentials (Client ID and Secret from Google Cloud Console)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development

# Google OAuth - Get these from Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Secret - Generate a strong secret key
JWT_SECRET=your_jwt_secret_key_here

# Session Secret - Generate a strong secret key
SESSION_SECRET=your_session_secret_key_here

SOCKET_IO_ORIGIN=http://localhost:3000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/auth/google/callback` to authorized redirect URIs
6. Copy Client ID and Client Secret to `.env`

### 4. Run the Application

**Development Mode (with auto-reload):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

The server will start on `http://localhost:3000`

## 📂 Project Structure

```
src/
├── config/              # Configuration files
│   └── env.js          # Environment variables
├── controllers/         # Business logic
│   ├── AuthController.js
│   └── UserController.js
├── middleware/          # Express middleware
│   ├── authMiddleware.js
│   └── passport.js     # Google OAuth strategy
├── models/             # Data models
│   └── User.js
├── repos/              # Data repositories
│   └── UserRepository.js
├── routes/             # API routes
│   ├── authRoutes.js
│   └── userRoutes.js
├── socket/             # Socket.io configuration
│   └── socketManager.js
├── utils/              # Utility functions
│   └── authService.js
└── server.js           # Main server file
```

## 🔐 Authentication Flow

### Google OAuth Login

1. User clicks "Login with Google"
2. Redirected to `/auth/google`
3. Google OAuth screen shown
4. After approval, redirected to `/auth/google/callback`
5. User created/updated in database
6. JWT token generated and stored in HTTP-only cookie
7. Redirected to frontend with token

### Token Verification

- All authenticated routes require JWT token
- Token can be sent via:
  - `Authorization: Bearer <token>` header
  - `token` cookie
- Token verified using `verifyToken` middleware

## 🔌 Socket.io Events

### Connection

```javascript
// Client connects with token
socket = io("http://localhost:3000", {
  auth: {
    token: "your_jwt_token",
  },
});
```

### Room Management

```javascript
// Join a room
socket.emit("join-room", "room-id");

// Leave a room
socket.emit("leave-room", "room-id");

// Get users in a room
socket.emit("get-room-users", "room-id", (users) => {
  console.log(users);
});
```

### Messaging

```javascript
// Send room message
socket.emit("send-message", {
  roomId: "room-id",
  message: "Hello everyone!",
});

// Listen for room messages
socket.on("receive-message", (data) => {
  console.log(data.userName, ":", data.message);
});

// Send private message
socket.emit("send-private-message", {
  targetUserId: "user-id",
  message: "Private message",
});

// Listen for private messages
socket.on("receive-private-message", (data) => {
  console.log("Private from", data.fromUserName, ":", data.message);
});
```

### User Events

```javascript
// Listen for user joining room
socket.on("user-joined", (data) => {
  console.log(data.userName, "joined the room");
});

// Listen for user leaving room
socket.on("user-left", (data) => {
  console.log(data.userName, "left the room");
});

// Listen for user disconnection
socket.on("user-disconnected", (data) => {
  console.log(data.userName, "disconnected");
});
```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint                | Description                 | Auth Required |
| ------ | ----------------------- | --------------------------- | ------------- |
| GET    | `/auth/google`          | Initiate Google OAuth login | No            |
| GET    | `/auth/google/callback` | Google OAuth callback       | No            |
| GET    | `/auth/verify`          | Verify current token        | Yes           |
| POST   | `/auth/refresh`         | Refresh token               | Yes           |

### User Routes

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| GET    | `/api/users/profile` | Get current user profile | Yes           |
| PUT    | `/api/users/profile` | Update user profile      | Yes           |
| POST   | `/api/users/logout`  | Logout user              | Yes           |
| GET    | `/api/users`         | Get all users            | Yes           |
| GET    | `/api/users/:id`     | Get user by ID           | Yes           |

### Health Check

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Server health status |

## 🔄 Authentication Middleware

### verifyToken

Verifies JWT token and attaches user to request object.

```javascript
app.get("/protected", verifyToken, (req, res) => {
  console.log(req.user); // Authenticated user
});
```

### isAuthenticated

Checks if user is authenticated.

```javascript
app.get("/protected", verifyToken, isAuthenticated, (req, res) => {
  // Only authenticated users reach here
});
```

## 📦 Dependencies

- **express** - Web framework
- **socket.io** - Real-time communication
- **passport** - Authentication middleware
- **passport-google-oauth20** - Google OAuth strategy
- **jsonwebtoken** - JWT token generation/verification
- **dotenv** - Environment variable management
- **cors** - CORS middleware
- **express-session** - Session management
- **cookie-parser** - Cookie parsing

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

Uses `nodemon` for automatic server restart on file changes.

### Debugging

Add `console.log` statements or use VS Code debugger:

1. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/server.js"
    }
  ]
}
```

2. Press F5 to start debugging

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set secure `JWT_SECRET` and `SESSION_SECRET`
- [ ] Update `GOOGLE_CALLBACK_URL` to production domain
- [ ] Enable HTTPS (`secure: true` in cookies)
- [ ] Use production database
- [ ] Set up environment variables on hosting platform

### Deployment Options

- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Vercel (with serverless functions)

## 🐛 Troubleshooting

### "Google OAuth credentials not configured"

- Ensure `.env` file exists and has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Restart the server after updating `.env`

### Socket.io Connection Fails

- Check that authentication token is valid
- Verify CORS settings in `.env`
- Ensure client sends token in `auth` option

### Port Already in Use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Windows - use Task Manager or:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📝 Notes

- User data is currently stored in-memory. Replace `UserRepository` with database implementation for production.
- Socket.io stores user data in socket instance. Use Redis adapter for multiple server instances.
- This is a basic setup. Add more validation, error handling, and security features as needed.

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and structure.

## 📞 Support

For issues or questions, please create an issue or contact the development team.
