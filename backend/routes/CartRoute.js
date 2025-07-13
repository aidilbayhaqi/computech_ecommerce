import express from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseFromCart,
} from "../controller/CartController.js";

const router = express.Router();

router.get("/cart", verifyToken, getCart);
router.post("/cart", verifyToken, addToCart);
router.delete("/cart/:itemId", verifyToken, removeFromCart);
router.patch("/cart/decrease", verifyToken, decreaseFromCart);

export default router;
