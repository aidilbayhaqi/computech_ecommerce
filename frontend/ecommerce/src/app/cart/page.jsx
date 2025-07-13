"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, loading, removeFromCart } = useCart();
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const cartItems = cart?.CartItems || [];

  useEffect(() => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    const totalQty = selectedCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalHarga = selectedCartItems.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );

    setTotalItems(totalQty);
    setTotalPrice(totalHarga);
  }, [cartItems, selectedItems]);

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCheckout = () => {
    const selectedData = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedData.length === 0) {
      alert("Silakan pilih produk yang ingin dibeli.");
      return;
    }

    sessionStorage.setItem("selectedCartItems", JSON.stringify(selectedData));
    router.push("/order");
  };

  if (loading) {
    return <div className="text-center py-24">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-6 pt-24 pb-10 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaShoppingCart size={28} />
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-md"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="w-5 h-5 accent-purple-600"
                  />
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${
                      item.Product.image?.split(",")[0]
                    }`}
                    alt={item.Product.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover"
                    unoptimized
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.Product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Tipe: {item.type || "-"}
                    </p>
                    <p className="text-blue-600 dark:text-purple-400 font-bold">
                      Rp
                      {(item.Product.price * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total Price</span>
              <span className="font-bold text-blue-600 dark:text-purple-400">
                Rp{totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-purple-700 dark:to-purple-900 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
