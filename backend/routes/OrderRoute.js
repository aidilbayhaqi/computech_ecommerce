import express from "express";
import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";
import {
  getOrderById,
  createOrder,
  updateOrderStatus,
  getAllOrders,
  deleteOrderIfCancelled,
  getMyOrders,
} from "../controller/OrderController.js";

const router = express.Router();

router.post("/order", verifyToken, createOrder);
router.get("/order", verifyToken, isAdmin, getAllOrders);
router.get("/order/me", verifyToken, getMyOrders);
router.get("/order/:id", verifyToken, getOrderById);
router.patch("/order/status", verifyToken, updateOrderStatus);
router.delete("/order/:id", verifyToken, deleteOrderIfCancelled);

export default router;
