"use client";
import { useState, useEffect } from "react";
import { getAllCart } from "../services/cart";
import { getProductById } from "../services/product";
import { createOrder } from "../services/order";
import { currentUser } from "../services/auth";

export const useOrder = (productId = null, selectedType = "", quantity = 1) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState({ CartItems: [] });
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await currentUser();
        setAddress(user?.address || "");

        if (productId) {
          const res = await getProductById(productId);
          const images = res.products.image
            .split(",")
            .map(
              (img) =>
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${img.trim()}`
            );

          const normalizedProduct = {
            ...res.products,
            quantity: Number(quantity) || 1,
            image: images, // Ubah jadi array berisi URL lengkap
            type: selectedType,
          };

          setProduct(normalizedProduct);
        } else {
          // FROM CART
          const stored = sessionStorage.getItem("selectedCartItems");
          if (stored) {
            const parsed = JSON.parse(stored);
            const normalizedCartItems = parsed.map((item) => ({
              ...item,
              Product: item.Product,
              image: item.Product?.image
                ?.split(",")
                .map(
                  (img) =>
                    `${
                      process.env.NEXT_PUBLIC_BACKEND_URL
                    }/uploads/${img.trim()}`
                ),
            }));
            setCart({ CartItems: normalizedCartItems });
          }
        }
      } catch (err) {
        console.error("Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, selectedType, quantity]);

  const postOrder = async () => {
    try {
      const items = productId
        ? [
            {
              product_id: product.id,
              quantity: product.quantity,
              type: product.type || null,
            },
          ]
        : cart.CartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            type: item.type || null,
          }));

      const total_price = productId
        ? product.price * product.quantity
        : cart.CartItems.reduce(
            (sum, item) => sum + item.Product.price * item.quantity,
            0
          );

      if (!items.length) throw new Error("Tidak ada produk dalam pesanan.");
      if (!address) throw new Error("Alamat pengiriman wajib diisi.");

      const res = await createOrder({
        items,
        total_price,
        address,
        status_payment: "pending",
      });

      return {
        order_id: res.order_id,
        gross_amount: total_price,
      };
    } catch (err) {
      throw err;
    }
  };

  return {
    loading,
    product,
    cart,
    address,
    isEditing,
    setIsEditing,
    setAddress,
    postOrder,
  };
};
