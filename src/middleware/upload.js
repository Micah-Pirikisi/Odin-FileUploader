import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File validation
function fileFilter(req, file, cb) {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
    "text/plain",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("File type not allowed"), false);
  }

  cb(null, true);
}

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});
