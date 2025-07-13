"use client";
import { useEffect, useState } from "react";
import OrderTable from "./order";
import PaymentTable from "./payment";
import { getMyOrders } from "@/app/services/order";
import { getMyPayments } from "@/app/services/payment";
import { currentUser } from "../services/auth";

export default function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState("order");
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]=useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await currentUser();
        if (!user) return;

        const [orderRes, paymentRes] = await Promise.all([
          getMyOrders(user.id),
          getMyPayments(user.id),
        ]);

        setOrders(orderRes);
        setPayments(paymentRes);
      } catch (err) {
        console.error("Gagal memuat riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen px-6 pt-24 pb-10 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "order"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700 text-white"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700  text-white"
          }`}
          onClick={() => setActiveTab("order")}
        >
          History Order
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "payment"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700 text-white"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700  text-white"
          }`}
          onClick={() => setActiveTab("payment")}
        >
          History Payment
        </button>
      </div>

      {activeTab === "order" ? (
        <OrderTable data={orders} />
      ) : (
        <PaymentTable data={payments} />
      )}
    </div>
  );
}
