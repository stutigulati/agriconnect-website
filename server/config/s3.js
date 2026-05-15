import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const isS3Configured = () => Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET &&
  process.env.AWS_REGION
);

function createS3Client() {
  // Trim any whitespace/newlines that might corrupt the key
  const accessKeyId     = (process.env.AWS_ACCESS_KEY_ID     || '').trim();
  const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();
  const region          = (process.env.AWS_REGION            || 'us-east-1').trim();

  console.log('[s3] Creating client — key:', accessKeyId, '| region:', region);

  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function getBucket() {
  return (process.env.AWS_S3_BUCKET || '').trim();
}

function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only jpg, jpeg, png, and webp images are allowed.'), false);
}

const diskStorage = multer.diskStorage({
  destination: 'server/uploads/',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const lazyStorage = {
  _handleFile(req, file, cb) {
    if (isS3Configured()) {
      const bucket = getBucket();
      console.log('[s3] Uploading to bucket:', bucket);
      const storage = multerS3({
        s3:          createS3Client(),
        bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          cb(null, `community-posts/${uuidv4()}${ext}`);
        },
      });
      storage._handleFile(req, file, cb);
    } else {
      diskStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    diskStorage._removeFile(req, file, cb);
  },
};

export const uploadS3 = multer({
  storage:  lazyStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export function getUploadedFileUrl(file) {
  if (!file) return '';
  if (file.location) return file.location;
  return `/uploads/${file.filename}`;
}
