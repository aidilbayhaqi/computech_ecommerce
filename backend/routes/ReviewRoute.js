import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  deleteReview,
  updateReview,
} from "../controller/ReviewController.js";
import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/review", verifyToken, createReview);
router.get("/review", getAllReviews);
router.get("/review/:product_id", getReviewsByProduct);
router.put("/review/:product_id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router