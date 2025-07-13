"use client";
import { getAllPayment } from "@/app/services/payment";
import { exportToExcel } from "@/app/utils/ExportToExcel";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaWallet } from "react-icons/fa";

export default function PaymentDashboard() {
  const handleManualPrint = () => {
    const printContents = document.getElementById("print-area").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload halaman setelah print
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState([]);

  useEffect(() => {
    const fetchPayment = async () => {
      const data = await getAllPayment();
      setPayment(data);
    };

    fetchPayment();
  }, []);

  console.log(payment);

  const filtered = payment.filter((p) => {
    const matchSearch =
      p.Order?.User.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.order_id.toString().toLowerCase().includes(search.toLowerCase());

    const date = new Date(p.createdAt);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;

    return matchSearch && afterStart && beforeEnd;
  });

  const totalPaid = useMemo(() => {
    return payment
      .filter((p) => p.payment_status === "paid")
      .reduce((acc, curr) => acc + Number(curr.gross_amount), 0);
  }, [payment]);

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pembayaran</h1>
      <div className="bg-[#1f1f1f] mb-3 p-3 flex justify-between items-center">
        <div className="p-5 items-center">
          <h1 className="text-3xl font-bold flex gap-3">
            <span>
              <FaWallet />
            </span>
            Total Pemasukan
          </h1>
          <p className="text-emerald-500 mt-3 font-bold text-3xl">
            Rp {totalPaid.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="gap-3 flex flex-wrap">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#1f1f1f] text-white p-2 rounded border border-gray-600"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#1f1f1f] text-white p-2 rounded border border-gray-600"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => exportToExcel(payment)}
          >
            Export to Excel
          </button>
          <button
            onClick={handleManualPrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Print
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Cari pengguna atau ID pesanan..."
        className="mb-4 p-2 w-full bg-[#1f1f1f] rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="print:overflow-visible" id="print-area">
        <table className="w-full border-collapse bg-[#1a1a1a] rounded overflow-hidden">
          <thead>
            <tr className="bg-[#222]">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">date</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment, i) => (
              <tr key={i} className="border-b border-[#333]">
                <td className="p-3">{payment.order_id}</td>
                <td className="p-3">{payment.Order?.User.name}</td>
                <td className="p-3">
                  {payment.Order.OrderItems?.map((item, idx) => (
                    <li className="list-none" key={idx}>
                      {item.Product.name}
                    </li>
                  ))}
                </td>
                <td className="p-3">
                  {payment.Order.OrderItems?.map((item, idx) => (
                    <li className="list-none" key={idx}>
                      {item.quantity}
                    </li>
                  ))}
                </td>
                <td className="p-3">
                  {new Date(payment.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td className="p-3">
                  Rp {Number(payment.gross_amount).toLocaleString("id-ID")}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold
                  ${
                    payment.payment_status === "paid"
                      ? "bg-green-600"
                      : payment.status === "Pending"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                  >
                    {payment.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
