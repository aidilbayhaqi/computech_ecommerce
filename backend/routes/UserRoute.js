import express from "express";
import {
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} from "../controller/UserController.js";
import upload from "../middleware/upload.js";
import { isAdmin, verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.put(
  "/user/:id",
  upload.single("image"),
  verifyToken,
  updateUser
);
router.get("/user", getUser);
router.get("/user/:id", verifyToken, getUserById);
router.delete("/user/:id", verifyToken, deleteUser);
router.patch("/user/change-password", verifyToken, changePassword);

export default router;
