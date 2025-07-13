import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./database/database.js";
import {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Shipping,
  Review,
} from "./models/models.js"; // Import model dan relasinya
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import CartRoute from "./routes/CartRoute.js";
import OrderRoute from "./routes/OrderRoute.js";
import PaymentRoute from "./routes/PaymentRoute.js";
import ShippingRoute from "./routes/ShippingRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Untuk mendapatkan __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve folder uploads secara publik

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://192.168.56.1:3000",
    ],

    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(UserRoute);
app.use(AuthRoute);
app.use(ProductRoute);
app.use(CartRoute);
app.use(OrderRoute);
app.use(PaymentRoute);
app.use(ShippingRoute);
app.use(ReviewRoute);

// Tes koneksi dan sinkronisasi
try {
  await db.authenticate();
  console.log("✅ Database connected...");
  await db.sync({ alter: true }); // alter: true untuk dev
  console.log("✅ All models synchronized...");
} catch (error) {
  console.error("❌ Database connection failed:", error);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
