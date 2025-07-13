// middleware/AuthMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Ambil dari cookie

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};
  


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Akses denied. Only for Admin." });
  }
  next();
};
