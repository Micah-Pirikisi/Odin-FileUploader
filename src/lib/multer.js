import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: path.join("uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "application/pdf"];
  cb(null, allowed.includes(file.mimetype));
};

// Create the upload instance
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});
