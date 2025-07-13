import Shipping from "../models/ShippingModels.js";
import Order from "../models/OrderModels.js";
import User from "../models/UserModels.js";
import {nanoid} from 'nanoid'

export const createShipping = async (req, res) => {
  try {
    const { order_id, courier, shipping_cost, address } = req.body;

    const order = await Order.findByPk(order_id);

    // Generate tracking number otomatis (contoh: JNE-XXXX)
    const tracking_number = `TRX-${nanoid(10).toUpperCase()}`;

    if (!order_id || !courier || !shipping_cost || !address) {
      return res
        .status(400)
        .json({ message: "Semua data pengiriman wajib diisi" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }


    const shipping = await Shipping.create({
      order_id,
      courier,
      shipping_cost,
      address,
      shipping_status: "preparing",
      tracking_number,
    });
    res
      .status(201)
      .json({ message: "Data pengiriman berhasil dibuat", shipping });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all shipping records
export const getAllShipping = async (req, res) => {
  try {
    const shipping = await Shipping.findAll({
      include: Order,
    });
    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get shipping by order ID
export const getShippingByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;

    const shipping = await Shipping.findOne({ where: { order_id } });

    if (!shipping) {
      return res
        .status(404)
        .json({ message: "Data pengiriman tidak ditemukan" });
    }

    res.status(200).json(shipping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update shipping status
export const updateShippingStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { shipping_status, tracking_number } = req.body;

    // Validasi input wajib
    if (!order_id) {
      return res.status(400).json({ message: "order_id wajib disertakan" });
    }

    const shipping = await Shipping.findOne({ where: { order_id } });

    if (!shipping) {
      return res
        .status(404)
        .json({ message: "Data pengiriman tidak ditemukan" });
    }

    const allowedStatuses = ["preparing", "shipped", "delivered"];

    // Validasi shipping_status jika dikirim
    if (shipping_status && !allowedStatuses.includes(shipping_status)) {
      return res.status(400).json({
        message: `Status tidak valid. Gunakan salah satu dari: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    // Hanya update jika ada perubahan
    if (shipping_status && shipping_status !== shipping.shipping_status) {
      shipping.shipping_status = shipping_status;

      // Jika status menunjukkan barang dikirim, set waktu kirim
      if (["shipped", "delivered"].includes(shipping_status)) {
        shipping.shipped_at = new Date();
      }
    }

    if (tracking_number && tracking_number !== shipping.tracking_number) {
      shipping.tracking_number = tracking_number;
    }

    await shipping.save();

    res.status(200).json({
      message: "Status pengiriman berhasil diperbarui",
      shipping,
    });
  } catch (error) {
    console.error("Gagal update status shipping:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const deleteShipping = async (req, res) => {
  try {
    const { order_id } = req.params;

    const shipping = await Shipping.findOne({ where: { order_id } });
    if (!shipping) {
      return res.status(404).json({ message: "Shipping tidak ditemukan" });
    }

    await shipping.destroy();
    res.status(200).json({ message: "Shipping berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShippingByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Asumsi ini diset dari middleware autentikasi

    // Temukan semua order milik user
    const orders = await Order.findAll({
      where: { user_id: userId },
      attributes: ["id"], // hanya ambil id order
    });

    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) {
      return res
        .status(404)
        .json({ message: "User belum memiliki pesanan (order)" });
    }

    // Ambil semua shipping yang berkaitan dengan order user
    const shippings = await Shipping.findAll({
      where: {
        order_id: orderIds,
      },
      include: [
        {
          model: Order,
          attributes: ["id", "user_id", "status_payment"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (shippings.length === 0) {
      return res
        .status(404)
        .json({ message: "Data pengiriman tidak ditemukan" });
    }

    res.status(200).json(shippings);
  } catch (error) {
    console.error("Error getShippingByUser:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
