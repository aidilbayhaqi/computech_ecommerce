"use client";
import React from "react";
import { deleteOrder } from "../services/order";
import { useRouter } from "next/navigation";

export default function OrderTable({ data }) {
  const router = useRouter();
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin membatalkan order ini?");
    if (!confirmDelete) return;

    try {
      await deleteOrder(id);
      alert("order berhasil dibatalkan");
      router.push('/payment');
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat membatalkan order."
      );
    }
  };
  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      <table className="min-w-full table-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="px-6 py-4 text-sm font-semibold">Order ID</th>
            <th className="px-6 py-4 text-sm font-semibold">Tanggal</th>
            <th className="px-6 py-4 text-sm font-semibold">Produk</th>
            <th className="px-6 py-4 text-sm font-semibold">Alamat</th>
            <th className="px-6 py-4 text-sm font-semibold">Total</th>
            <th className="px-6 py-4 text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((order, index) => (
            <tr
              key={`order-${order.id || index}`}
              className="border-b hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4">{order.id}</td>
              <td className="px-6 py-4">
                {new Date(order.createdAt).toLocaleDateString("id-ID")}
              </td>
              <td className="px-6 py-4">
                {order.OrderItems?.[0]?.Product?.name ||
                  "Produk tidak ditemukan"}
              </td>
              <td className="px-6 py-4">{order.address}</td>
              <td className="px-6 py-4">
                Rp{order.total_price?.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4 capitalize">
                <span
                  className={
                    order.status_payment === "complete"
                      ? "text-green-600"
                      : order.status_payment === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {order.status_payment}
                </span>
              </td>
              <td className="px-4 py-3">
                {order.status_payment === "pending" && (
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Batalkan
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
