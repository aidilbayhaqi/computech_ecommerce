// controller/PaymentController.js
import snap from "../database/midtrans.js";
import User from "../models/UserModels.js";
import Order from "../models/OrderModels.js";
import OrderItem from "../models/OrderItem.js";
import Payment from "../models/paymentModels.js";
import { v4 as uuidv4 } from "uuid";
import Product from "../models/ProductModels.js";

export const createPayment = async (req, res) => {
  const { order_id, gross_amount } = req.body;

  try {
    const transaction_id = uuidv4(); // UUID unik untuk transaksi
    const payment_gateway_id = `ORDER-${Date.now()}`; // ID unik untuk Midtrans

    const parameter = {
      transaction_details: {
        order_id: payment_gateway_id,
        gross_amount: gross_amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: req.user.email,
      },
    };

    // Buat transaksi ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Simpan ke DB
    await Payment.create({
      order_id,
      transaction_id,
      payment_gateway_id,
      gross_amount: Number(gross_amount),
      payment_status: "pending",
    });

    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaction_id,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: {
        model: Order,
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ["id", "name", 'price', 'stock'],
              },
            ],
          },
        ],
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const userId = req.params.id;

    const payments = await Payment.findAll({
      include: {
        model: Order,
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            include: [{ model: Product }],
          },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get detail pembayaran by transaction_id
export const getPaymentByTransactionId = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { transaction_id: req.params.transaction_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const handleMidtransCallback = async (req, res) => {
  const notification = req.body;

  try {
    const statusResponse = await snap.transaction.notification(notification);
    console.log("Notifikasi dari Midtrans:", statusResponse);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    // Temukan payment berdasarkan payment_gateway_id
    const payment = await Payment.findOne({
      where: { payment_gateway_id: orderId },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment tidak ditemukan" });
    }

    // Update status berdasarkan notifikasi dari Midtrans
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      payment.payment_status = "paid";

      // Update status order juga
      const order = await Order.findByPk(payment.order_id, {
        include: OrderItem,
      });

      if (order) {
        order.status_payment = "complete";
        await order.save();
      }
    } else if (transactionStatus === "pending") {
      payment.payment_status = "pending";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "expire" ||
      transactionStatus === "deny"
    ) {
      // Optional: hapus payment atau mark as failed
      payment.payment_status = "failed";
    }

    await payment.save();

    res.status(200).json({ message: "Notifikasi Midtrans diproses" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
