import express from "express";
import {
  createPayment,
  getAllPayments,
  getMyPayments,
  getPaymentByTransactionId,
  handleMidtransCallback
} from "../controller/PaymentController.js";
import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Buat payment (dipanggil saat order dibuat dan payment diproses)
router.post("/transaction", verifyToken, createPayment);

// Ambil semua data payment (misalnya untuk admin dashboard)
router.get("/transaction", verifyToken, isAdmin, getAllPayments);

// Ambil 1 payment berdasarkan ID transaksi (UUID)
router.get("/transaction/:transaction_id", verifyToken, getPaymentByTransactionId);

router.get("/payment/:id", verifyToken, getMyPayments);

// Callback Midtrans (jangan pakai verifyToken karena ini dipanggil oleh Midtrans)
router.post("/payment/notification", handleMidtransCallback);

export default router;
