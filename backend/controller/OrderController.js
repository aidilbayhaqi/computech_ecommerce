import Order from "../models/OrderModels.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/ProductModels.js";
import User from "../models/UserModels.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role", "address", "no_hp"],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "image"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ message: "Success", data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const { items, total_price, address, status_payment, payment_id } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Order item tidak boleh kosong" });
  }

  try {
    let shippingAddress = address;

    if (!shippingAddress) {
      const user = await User.findByPk(req.user.id);
      if (!user || !user.address) {
        return res.status(400).json({
          message:
            "Alamat tidak tersedia, harap lengkapi profil terlebih dahulu.",
        });
      }
      shippingAddress = user.address;
    }
    // 1. Buat Order
    const order = await Order.create({
      user_id: req.user.id,
      total_price: total_price,
      address: shippingAddress,
      status_payment: status_payment || "pending",
      payment_id: payment_id,
    });

    // 2. Buat semua OrderItem dan kurangi stok produk
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stok produk tidak mencukupi untuk ${product?.name}`,
        });
      }

      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
        type: item.type || null,
      });
    }

    res
      .status(201)
      .json({ message: "Order berhasil dibuat", order_id: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: { id, user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }],
        },
      ],
    });

    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: {
        model: OrderItem,
        include: Product,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { order_id, status_payment } = req.body;

  if (!order_id || !status_payment) {
    return res
      .status(400)
      .json({ message: "orderId dan status harus disertakan" });
  }

  try {
    const order = await Order.findByPk(order_id, {
      include: OrderItem,
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (status_payment === "complete") {
      // Cek apakah sudah dikurangi sebelumnya
      if (order.status_payment !== "complete") {
        for (const item of order.OrderItems) {
          const product = await Product.findByPk(item.product_id);
          if (product.stock < item.quantity) {
            return res.status(400).json({
              message: `Stok tidak mencukupi untuk produk: ${product.name}`,
            });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
      order.status_payment = "complete";
      await order.save();
      return res.status(200).json({ message: "Order diselesaikan", order });
    }

    if (status_payment === "cancelled") {
      // Hapus OrderItem dulu
      await OrderItem.destroy({ where: { order_id: order.id } });

      // Lalu hapus Order
      await order.destroy();
      return res.status(200).json({ message: "Order dibatalkan dan dihapus" });
    }

    // Jika hanya update ke status lain seperti pending, paid, dll
    order.status = status_payment;
    await order.save();
    return res.status(200).json({ message: "Status order diperbarui", order });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const deleteOrderIfCancelled = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id, {
      include: [OrderItem],
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (order.status_payment !== "pending") {
      return res.status(400).json({
        message: "Order hanya dapat dihapus jika status-nya adalah 'cancelled'",
      });
    }

    // Hapus semua order item terlebih dahulu (jika ada relasi)
    await OrderItem.destroy({ where: { order_id: id } });

    // Hapus order
    await Order.destroy({ where: { id } });

    res.status(200).json({ message: "Order berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
