import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'incidents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate safe filename to prevent path traversal or overwrites
    const uniqueSuffix = randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `\${Date.now()}-\${uniqueSuffix}\${ext}`);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPEG, PNG, WEBP images and MP4, WEBM videos are allowed.'));
  }
};

// Config
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // We set general limit to 50MB, then in controller we validate specific limits per file type
    fileSize: 50 * 1024 * 1024
  }
});
