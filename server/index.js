import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './config/db.js';
import communityRoutes from './routes/community.js';
import { seedCommunityData } from './seed.js';

const app  = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Ensure local uploads folder ───────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service:   'agriconnect-community-api',
    timestamp: new Date().toISOString(),
    s3:        Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET),
    bucket:    process.env.AWS_S3_BUCKET || 'not set',
    region:    process.env.AWS_REGION    || 'not set',
  });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/community', communityRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Image too large (max 10MB)' });
  if (err.message?.includes('Only jpg')) return res.status(415).json({ message: err.message });
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
connectDatabase()
  .then(seedCommunityData)
  .then(() => {
    app.listen(PORT, () => {
      console.log('\n🌾 AgriConnect Community API — READY');
      console.log(`   ➜  http://localhost:${PORT}/api/health`);
      console.log(`   ➜  S3: ${process.env.AWS_S3_BUCKET || 'not configured (local disk fallback)'}`);
      console.log(`   ➜  MongoDB: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriconnect'}\n`);
    });
  })
  .catch((err) => { console.error('Failed to start server:', err); process.exit(1); });
