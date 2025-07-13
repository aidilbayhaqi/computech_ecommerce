"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useOrder } from "../hooks/useOrder";
import { addPayment } from "../services/payment";
import { updateOrderStatus } from "../services/order";
import { createShipping } from "../services/shipping";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams ? searchParams.get("productId") : null;
  const types = searchParams.get("type") || "";
  const quantity = parseInt(searchParams.get("quantity") || "1");

  const {
    product,
    cart,
    address,
    isEditing,
    setIsEditing,
    setAddress,
    postOrder,
    loading,
    
  } = useOrder(productId, types, quantity);

  const [shippingCost, setShippingCost] = useState(15000);
  const [courier, setCourier] = useState("JNE");
  const [cartItemsFromStorage, setCartItemsFromStorage] = useState([]);


  // Ambil item yang dipilih dari sessionStorage (jika bukan dari productId langsung)
  useEffect(() => {
    if (!productId) {
      const stored = sessionStorage.getItem("selectedCartItems");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItemsFromStorage(parsed);
        } catch (e) {
          console.error("Gagal parse data keranjang:", e);
        }
      }
    }
  }, [productId]);

  const handleOrder = async () => {
    try {
      const order = await postOrder();
      Swal.fire({
        icon: "success",
        title: "Berhasil order product",
        confirmButtonColor: "#6D28D9",
      });

      const payment = await addPayment({
        order_id: order.order_id,
        gross_amount: Number(order.gross_amount + shippingCost),
      });

      await createShipping({
        order_id: order.order_id,
        courier,
        shipping_cost: shippingCost,
        address,
      });

      router.push(payment?.redirect_url || "/payment");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (productId && !product) return <p>Loading produk...</p>;

  const itemsToShow = productId
    ? [product]
    : cart?.CartItems?.length
    ? cart.CartItems
    : cartItemsFromStorage;

  const totalProductPrice = itemsToShow.reduce((total, item) => {
    const price = item?.price ?? item?.Product?.price ?? 0;
    const qty = productId ? quantity : item?.quantity ?? 1;
    return total + price * qty;
  }, 0);

  const totalPrice = totalProductPrice + shippingCost;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-20">
      <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Ringkasan Pesanan
        </h1>

        <div className="mb-4 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <span className="font-semibold block">Alamat:</span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded p-2 mt-2"
                disabled={!isEditing}
              />
              {isEditing ? (
                <button
                  onClick={() => setIsEditing(false)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Selesai Edit
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit Alamat
                </button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">Pilih Kurir</label>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="border bg-gray-900 rounded p-2 w-full"
            >
              <option value="JNE">JNE</option>
              <option value="J&T">J&T</option>
              <option value="POS">POS Indonesia</option>
            </select>

            <label className="block mt-4 mb-2 font-medium">Biaya Ongkir</label>
            <input
              type="number"
              value={shippingCost}
              onChange={(e) => setShippingCost(Number(e.target.value))}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {itemsToShow.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Image
                  width={200}
                  height={200}
                  src={item.image?.[0] || "/placeholder.png"}
                  alt={item?.name || item?.Product?.name || "produk"}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {item?.name || item?.Product?.name || "Nama tidak tersedia"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {productId ? quantity : item?.quantity ?? 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tipe: {productId ? types : item?.type || "-"}
                  </p>
                </div>
              </div>
              <div className="font-bold text-blue-600 dark:text-purple-400">
                Rp{" "}
                {(item?.price ?? item?.Product?.price ?? 0).toLocaleString(
                  "id-ID"
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <h2 className="text-xl font-semibold">Total</h2>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          onClick={handleOrder}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Bayar Sekarang
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Anda akan diarahkan ke halaman pembayaran...
        </p>
      </div>
    </div>
  );
}
