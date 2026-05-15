import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, S3_BUCKET, isS3Configured } from './s3.js';

/* ─── Allowed MIME types ─────────────────────────────────────────────────── */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, and png images are allowed.'), false);
  }
}

/* ─── Storage: S3 (production) ───────────────────────────────────────────── */
const s3Storage = multerS3({
  s3: s3Client,
  bucket: S3_BUCKET,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `community/${uuidv4()}${ext}`);
  },
});

/* ─── Storage: Local disk (dev / demo fallback) ──────────────────────────── */
const diskStorage = multer.diskStorage({
  destination: 'server/uploads/',
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

/* ─── Export configured multer instance ──────────────────────────────────── */
export const uploadMiddleware = multer({
  storage: isS3Configured() ? s3Storage : diskStorage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

/**
 * Extracts the public URL from an uploaded file.
 *  - S3:   req.file.location  (set by multer-s3)
 *  - Disk: build a relative path served by Express static
 */
export function getUploadedFileUrl(file) {
  if (!file) return '';
  if (isS3Configured() && file.location) return file.location;
  return `/uploads/${file.filename}`;
}
