import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModels.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, role, address, no_hp } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password tidak cocok" });
    }

    // Cek jika email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      address,
      no_hp,
      password: hash,
      role: role || "user",
      image: req.file ? req.file.filename : null,
    });

    res
      .status(200)
      .json({ message: "User berhasil resgitrasi", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "user not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(404).json({ message: "wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Mengirimkan token melalui cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 hari
    });

    // Juga bisa mengirimkan token di body response jika perlu
    res.json({ message: "login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // req.user.id diisi oleh verifyToken middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token"); // jika disimpan di cookie
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

export const googleLogin = async (req, res) => {
  const { name, email, avatar } = req.body;

  try {
    // Cek apakah user dengan email ini sudah ada
    let user = await User.findOne({ where: { email } });

    // Jika belum, daftarkan user baru
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
        password: "", // karena akun Google, password bisa dikosongkan
        role: "user",
      });
      console.log("User baru dibuat melalui login Google:", user.email);
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Kirim token sebagai cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 hari
      secure: false, // set true jika HTTPS
      sameSite: "lax",
    });

    // Kirimkan data user
    res.status(200).json({
      message: "Login Google berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res
      .status(500)
      .json({ message: "Login Google gagal", error: error.message });
  }
};

export const registerGoogleUser = async (req, res) => {
  const { email, name, avatar } = req.body;

  try {
    await db.query("INSERT INTO users (name, email, avatar) VALUES (?, ?, ?)", [
      name,
      email,
      avatar,
    ]);
    return res.status(201).json({ message: "User berhasil didaftarkan" });
  } catch (err) {
    return res.status(500).json({ message: "Gagal register" });
  }
};
