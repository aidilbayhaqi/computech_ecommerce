"use client";
import { useEffect, useState } from "react";
import { getMyShipping } from "../services/shipping";

export default function ShippingHistory() {
  const [shippings, setShippings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const data = await getMyShipping();
        setShippings(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShipping();
  }, []);

  if (loading) return <div className="p-10">Loading shipping history...</div>;

  return (
    <div className="min-h-screen px-6 pt-24 pb-10 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Shipping History</h1>
      {shippings.length === 0 ? (
        <p>Tidak ada data pengiriman</p>
      ) : (
        <table className="min-w-full table-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="px-6 py-4 text-sm font-semibold">Order ID</th>
              <th className="px-6 py-4 text-sm font-semibold">Kurir</th>
              <th className="px-6 py-4 text-sm font-semibold">Alamat</th>
              <th className="px-6 py-4 text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-sm font-semibold">No. Resi</th>
            </tr>
          </thead>
          <tbody>
            {shippings.map((item) => (
              <tr
                key={item.id}
                className="border-b text-center hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4">{item.order_id}</td>
                <td className="px-6 py-4">{item.courier}</td>
                <td className="px-6 py-4">{item.address}</td>
                <td className="px-6 py-4">{item.shipping_status}</td>
                <td className="px-6 py-4">{item.tracking_number || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
