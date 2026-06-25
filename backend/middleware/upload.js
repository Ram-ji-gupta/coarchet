const multer = require("multer");
const path = require("path");

// Allowed file types
const allowedFileTypes = /jpeg|jpg|png|webp|gif/;

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  // Check file extension
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // store in backend/uploads
  },
  filename: (req, file, cb) => {
    // Sanitize filename: remove special characters, spaces, etc.
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, Date.now() + "-" + sanitizedOriginalName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter
});
module.exports = upload;
