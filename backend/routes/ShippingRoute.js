import express from "express";
import {
  createShipping,
  getAllShipping,
  getShippingByOrderId,
  getShippingByUser,
  updateShippingStatus,
} from "../controller/ShippingController.js";
import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// POST - Buat data pengiriman baru
router.post("/shipping", verifyToken, createShipping);

// GET - Ambil semua data pengiriman
router.get("/shipping", verifyToken, isAdmin, getAllShipping);

// // GET - Ambil data pengiriman berdasarkan order_id
// router.get("/shipping/:order_id", verifyToken, getShippingByOrderId);

// PATCH - Update status pengiriman berdasarkan order_id
router.put("/shipping/:order_id", verifyToken, updateShippingStatus);

router.get('/shipping/me', verifyToken,getShippingByUser)

export default router;
