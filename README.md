# 🌾 AgriConnect — Full-Stack Farmer Community

A production-ready social platform for farmers with persistent MongoDB storage, AWS S3 image uploads, Reddit-style voting, and threaded discussions.

---

## ✅ What's Working

| Feature | Status |
|---|---|
| Post creation (with image) | ✅ |
| Posts persist after refresh | ✅ (MongoDB) |
| Upvote / Downvote posts | ✅ (no duplicates) |
| Upvote / Downvote comments | ✅ |
| Nested comments (Reddit-style) | ✅ (unlimited depth) |
| Reply to any comment | ✅ |
| Save / Bookmark posts | ✅ (persisted in DB) |
| Share posts (count tracked) | ✅ |
| Delete own posts / comments | ✅ |
| Camera access (mobile) | ✅ |
| Gallery upload | ✅ |
| Image preview before upload | ✅ |
| AWS S3 image storage | ✅ |
| Local disk fallback | ✅ |
| JWT Authentication | ✅ |
| Register / Login | ✅ |
| Demo login (no password) | ✅ |
| Search / filter / sort | ✅ |
| Infinite scroll pagination | ✅ |
| Offline demo mode (no backend) | ✅ |

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and AWS credentials
```

### 3. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (free cloud) — update MONGO_URI in .env
```

### 4. Start backend
```bash
npm run dev:server
# Runs on http://localhost:4000
```

### 5. Start frontend (new terminal)
```bash
npm run dev
# Runs on http://localhost:5173
```

---

## 🔧 Environment Variables

```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/agriconnect

# Auth
JWT_SECRET=your-very-secret-key-here

# Server
PORT=4000

# Frontend
VITE_API_URL=http://localhost:4000/api

# AWS S3 (optional — falls back to local disk)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

---

## 📁 Project Structure

```
agriconnect/
├── src/                          # React frontend
│   ├── components/
│   │   ├── CommunityPage.jsx     # Main community page
│   │   ├── AuthPage.jsx          # Login / Register modal
│   │   └── ...
│   └── lib/
│       └── communityApi.js       # API client (all endpoints)
│
└── server/                       # Express backend
    ├── index.js                  # App entry point
    ├── models/
    │   ├── User.js               # Users (Farmer/Agronomist/Buyer)
    │   ├── Post.js               # Posts with vote tallies
    │   ├── Comment.js            # Threaded comments
    │   └── Vote.js               # Vote records (prevents duplicates)
    ├── routes/
    │   └── community.js          # All API routes
    ├── middleware/
    │   └── auth.js               # JWT auth + optionalAuth
    └── config/
        ├── db.js                 # MongoDB connection
        ├── s3.js                 # S3 + multer config
        └── upload.js             # Upload helpers
```

---

## 🌐 API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/community/auth/register` | — | Register with email/password |
| POST | `/api/community/auth/login` | — | Login |
| POST | `/api/community/auth/demo-login` | — | Demo login (no password) |
| GET | `/api/community/posts` | Optional | Get posts (paginated) |
| POST | `/api/community/posts` | ✅ | Create post (multipart) |
| DELETE | `/api/community/posts/:id` | ✅ | Delete own post |
| POST | `/api/community/posts/:id/vote` | ✅ | Upvote/downvote post |
| POST | `/api/community/posts/:id/save` | ✅ | Toggle bookmark |
| POST | `/api/community/posts/:id/share` | — | Increment share count |
| GET | `/api/community/posts/:id/comments` | Optional | Get threaded comments |
| POST | `/api/community/posts/:id/comments` | ✅ | Add comment or reply |
| DELETE | `/api/community/posts/:id/comments/:cid` | ✅ | Delete own comment |
| POST | `/api/community/comments/:id/vote` | ✅ | Upvote/downvote comment |
