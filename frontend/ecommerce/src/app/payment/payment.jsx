"use client";
import React from "react";

export default function PaymentTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Payment History</h2>
      <table className="min-w-full table-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="px-6 py-4 text-sm font-semibold">Transaction ID</th>
            <th className="px-6 py-4 text-sm font-semibold">Tanggal</th>
            <th className="px-6 py-4 text-sm font-semibold">Produk</th>
            <th className="px-6 py-4 text-sm font-semibold">Alamat</th>
            <th className="px-6 py-4 text-sm font-semibold">Total</th>
            <th className="px-6 py-4 text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr
              key={item.transaction_id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 text-sm">{item.payment_gateway_id}</td>
              <td className="px-4 py-3">
                {new Date(item.createdAt).toLocaleDateString("id-ID")}
              </td>
              <td className="px-6 py-4 text-sm">
                {item.Order?.OrderItems?.[0]?.Product?.name ||
                  "Produk tidak ditemukan"}
              </td>
              <td className="px-6 py-4 text-sm">{item.Order?.address}</td>
              <td className="px-6 py-4 text-sm">
                Rp{item.gross_amount.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4 text-sm capitalize">
                <span
                  className={
                    item.payment_status === "paid"
                      ? "text-green-600"
                      : item.payment_status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {item.payment_status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
