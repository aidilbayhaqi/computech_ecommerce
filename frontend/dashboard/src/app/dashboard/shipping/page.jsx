"use client";
import React, { useState } from "react";

const dummyShipping = [
  {
    id: "ORD001",
    user: "Ahmad",
    courier: "JNE",
    tracking: "JNE123",
    address: "Jakarta",
    status: "Dikirim",
  },
  {
    id: "ORD002",
    user: "Dina",
    courier: "J&T",
    tracking: "JNT234",
    address: "Bandung",
    status: "Diproses",
  },
  {
    id: "ORD003",
    user: "Budi",
    courier: "SiCepat",
    tracking: "SC456",
    address: "Surabaya",
    status: "Diterima",
  },
];

export default function ShippingDashboard() {
  const [search, setSearch] = useState("");
  const filtered = dummyShipping.filter(
    (s) =>
      s.user.toLowerCase().includes(search.toLowerCase()) ||
      s.tracking.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pengiriman</h1>
      <input
        type="text"
        placeholder="Cari pengguna atau resi..."
        className="mb-4 p-2 w-full bg-[#1f1f1f] rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border-collapse bg-[#1a1a1a] rounded overflow-hidden">
        <thead>
          <tr className="bg-[#222]">
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Kurir</th>
            <th className="p-3 text-left">No Resi</th>
            <th className="p-3 text-left">Alamat</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((ship, i) => (
            <tr key={i} className="border-b border-[#333]">
              <td className="p-3">{ship.id}</td>
              <td className="p-3">{ship.user}</td>
              <td className="p-3">{ship.courier}</td>
              <td className="p-3">{ship.tracking}</td>
              <td className="p-3">{ship.address}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold
                  ${
                    ship.status === "Diterima"
                      ? "bg-green-600"
                      : ship.status === "Dikirim"
                      ? "bg-yellow-500"
                      : "bg-blue-600"
                  }`}
                >
                  {ship.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
