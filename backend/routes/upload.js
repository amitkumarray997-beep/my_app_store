const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + ".apk");
  },
});

const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === "application/vnd.android.package-archive" ||
    file.originalname.endsWith(".apk")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .apk files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB max
});

// POST /upload — protected, returns stored filename
router.post("/", auth, upload.single("apk"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No APK file uploaded" });
  return res.status(201).json({ filename: req.file.filename });
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
