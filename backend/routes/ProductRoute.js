import express from "express";
import {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/ProductController.js";
import { isAdmin, verifyToken } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get('/product',getProducts)
router.get('/product/:id', getProductById)
router.post("/product", verifyToken, upload.array("image", 3), createProduct);
router.put('/product/:id',verifyToken,isAdmin, upload.array('image',3),updateProduct)
router.delete("/product/:id", verifyToken, isAdmin, deleteProduct);

export default router
