# Mustache - Social Networking App for Men

A GoFriendly clone built with modern web technologies, designed specifically for men to connect, make friends, and build meaningful relationships.

## 🏗️ Project Structure

```
Mustache/
├── frontend/          # React + Vite frontend application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── README.md     # Frontend documentation
├── backend/           # Node.js + Express backend API
│   ├── src/          # Backend source code
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
└── README.md         # This file
```

## 🚀 Quick Start

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:8080

### Backend (Node.js + Express)
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```
Backend will run on: http://localhost:5000

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **MongoDB Atlas** database
- **Mongoose** ODM
- **JWT** authentication
- **Socket.IO** for real-time features

## 🌟 Features

- **User Authentication** - Secure login/registration
- **Profile Management** - Complete user profiles with photos
- **Friend System** - Send, accept, reject friend requests
- **Real-time Chat** - WebSocket-based messaging
- **Discovery Engine** - Find potential friends by interests
- **Privacy Controls** - Granular privacy settings
- **Mobile Responsive** - Works on all devices

## 📱 Pages

- **Home** - Landing page with features
- **Login/Register** - User authentication
- **Profile** - User profile management
- **Discover** - Find new friends
- **Messages** - Real-time chat system
- **Friends** - Manage friend connections

## 🔧 Development

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB Atlas account

### Environment Setup
1. Clone the repository
2. Set up frontend: `cd frontend && npm install`
3. Set up backend: `cd backend && npm install`
4. Copy `backend/env.example` to `backend/.env`
5. Add your MongoDB connection string to `.env`

### Running Both Services
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend  
cd backend
npm run dev
```

## 📦 Production Build & Deployment

### Frontend
```bash
cd frontend
npm run build
```
Deploy the `frontend/dist` folder to your static host (Nginx, Vercel, Netlify, etc.).

### Backend
```bash
cd backend
npm run build
npm start
```

Set `NODE_ENV=production` and configure your MongoDB Atlas connection, JWT secret,
and CORS origin in `.env`.

### Environment Checklist
- `MONGODB_URI` points to your production database
- `JWT_SECRET` is a long, random secret
- `CORS_ORIGIN` matches your deployed frontend URL
- `UPLOAD_PATH` exists and is writable (if using file uploads)
- Ensure your MongoDB Atlas IP allowlist includes your server

### Suggested Hosting
- **Frontend**: Vercel, Netlify, or any static host
- **Backend**: Render, Railway, Fly.io, or a VM/Container with PM2

### Vercel Deployment (Frontend)
1. Import the GitHub repo into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables:
   - `VITE_API_URL` = your deployed backend URL (e.g. `https://mustache-api.onrender.com`)
6. Ensure backend `CORS_ORIGIN` matches the deployed Vercel URL.

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend API Documentation](./backend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and personal use.

## 🆘 Support

For issues and questions:
1. Check the documentation in each folder
2. Review error logs
3. Verify environment configuration
4. Test database connectivity

---

**Note**: This is a full-stack social networking application. Both frontend and backend must be running for full functionality.
