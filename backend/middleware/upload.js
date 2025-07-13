import multer from "multer";
import path from "path";
import fs from "fs";

// Membuat folder uploads jika belum ada
const uploadPath = "public/uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Menentukan folder penyimpanan file
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Mendapatkan ekstensi file
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext; // Membuat nama file unik
    cb(null, uniqueName); // Menyimpan file dengan nama unik
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal ukuran file 5MB
  fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // Jika file sesuai jenis yang diizinkan
    } else {
      cb(new Error("Only images are allowed!")); // Menolak file yang tidak sesuai
    }
  },
});

export default upload;
