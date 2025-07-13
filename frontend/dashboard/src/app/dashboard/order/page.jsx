"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getAllOrder } from "@/app/services/order"; // pastikan fungsi ini ada
import { FaCheckCircle } from "react-icons/fa";
import { X } from "lucide-react";

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrder();
        setOrders(data);
        console.log("Order data:", data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const filtered = orders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(search.toLowerCase()) ||
      order.User?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.OrderItems?.some((item) =>
        item.product?.name?.toLowerCase().includes(search.toLowerCase())
      )
  );

  const totalComplete = useMemo(
    () => orders.filter((o) => o.status_payment === "complete").length,
    [orders]
  );
  const totalPending = useMemo(
    () => orders.filter((o) => o.status_payment === "pending").length,
    [orders]
  );
  const totalCanceled = useMemo(
    () => orders.filter((o) => o.status_payment === "cancelled").length,
    [orders]
  );

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard Order</h1>
      <div className="flex my-4 w-full justify-between">
        <div className="bg-[#1f1f1f] mb-3 p-3">
          <div className="p-5 items-center w-full">
            <h1 className="text-center items-center text-xl font-bold flex gap-3">
              ✅ Completed Orders
            </h1>
            <p className="text-emerald-500 mt-3 text-2xl">
              {totalComplete} order
            </p>
          </div>
        </div>
        <div className="bg-[#1f1f1f] mb-3 p-3">
          <div className="p-5 items-center w-full">
            <h1 className="text-center items-center text-xl font-bold flex gap-3">
              🕓 Pending Orders
            </h1>
            <p className="text-yellow-500 mt-3 text-2xl">
              {totalPending} order
            </p>
          </div>
        </div>
        <div className="bg-[#1f1f1f] mb-3 p-3">
          <div className="p-5 items-center w-full">
            <h1 className="text-center items-center text-xl font-bold flex gap-3">
              ❌ Canceled Orders
            </h1>
            <p className="text-red-500 mt-3 text-2xl">
              {totalCanceled} order
            </p>
          </div>
        </div>
      </div>
      <input
        type="text"
        placeholder="Cari ID Order atau Nama User..."
        className="mb-4 p-2 w-full bg-[#1f1f1f] rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse bg-[#1a1a1a] rounded overflow-hidden">
        <thead>
          <tr className="bg-[#222]">
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order, i) => (
            <tr key={i} className="border-b border-[#333]">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.User.name || "Tidak Diketahui"}</td>
              <td className="p-3">
                {order.OrderItems?.map((item, idx) => (
                  <li className="list-none" key={idx}>
                    {item.Product.name}
                  </li>
                ))}
              </td>
              <td className="p-3 items-center">
                {order.OrderItems?.map((item, idx) => (
                  <li className="list-none" key={idx}>
                    {item.quantity}
                  </li>
                ))}
              </td>
              <td className="p-3">
                Rp{parseInt(order.total_price).toLocaleString()}
              </td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold
                  ${
                    order.status_payment === "complete"
                      ? "bg-green-600"
                      : order.status_payment === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {order.status_payment}
                </span>
              </td>
              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
