"use client";
import { useState, useEffect } from "react";
import {
  getAllCart,
  postCart,
  deleteCartItem,
  decreaseCartItem,
} from "@/app/services/cart";

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Cart saat pertama kali
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getAllCart();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product_id, quantity = 1) => {
    try {
      await postCart(product_id, quantity);
      await fetchCart(); // refresh data
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const decreaseItem = async (product_id) => {
    try {
      await decreaseCartItem(product_id);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    decreaseItem,
    refreshCart: fetchCart,
  };
};
