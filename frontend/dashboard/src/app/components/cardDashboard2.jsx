"use client";

import { useEffect, useState } from "react";
import { getAllUser } from "../services/user";
import { parseISO, compareDesc } from "date-fns";
import { getAllProducts } from "../services/product";

export default function CardDashboard() {
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getAllUser();
      const product = await getAllProducts()

      // --- Ambil 5 user terbaru ---
      const sortedUsers = [...users].sort((a, b) =>
        compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
      );
      setLatestUsers(sortedUsers.slice(0, 5));

      // --- Hitung produk terlaris ---
      const sortedProduct = [...product].sort((a, b) =>
        compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
      );
      setLatestProduct(sortedProduct.slice(0, 5));
      
    };

    fetchData();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full mt-6">
      {/* Tabel user terbaru */}
      <div className="bg-white dark:bg-[#121212] p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          5 User Terbaru
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-secondary border-b border-gray-300 dark:border-gray-700">
              <th className="py-2">Nama</th>
              <th className="py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {latestUsers.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700">
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel produk terbaru */}
      <div className="bg-white dark:bg-[#121212] p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          Produk Terbaru
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-secondary border-b border-gray-300 dark:border-gray-700">
              <th className="py-2">Produk</th>
              <th className="py-2">Harga</th>
            </tr>
          </thead>
          <tbody>
            {latestProduct.map((product) => (
              <tr key={product.id} className="border-b dark:border-gray-700">
                <td className="py-2">{product.name}</td>
                <td className="py-2">Rp. {product.price.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
