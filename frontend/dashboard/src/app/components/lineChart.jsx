"use client";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { getAllPayment } from "../services/payment";
import { eachMonthOfInterval, format, parseISO } from "date-fns";
import { getAllUser } from "../services/user";

export default function DashboardChart() {
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const payments = await getAllPayment();
      const users = await getAllUser();

      const months = eachMonthOfInterval({
        start: new Date(new Date().getFullYear(), 0, 1),
        end: new Date(new Date().getFullYear(), 11, 31),
      });

      const data = months.map((monthDate) => {
        const label = format(monthDate, "MMM");

        const orderCount = payments.filter((p) => {
          const createdAt = parseISO(p.createdAt);
          return (
            createdAt.getMonth() === monthDate.getMonth() &&
            createdAt.getFullYear() === monthDate.getFullYear()
          );
        }).length;
        const userCount = users.filter((u) => {
          if (!u || !u.createdAt) return false;
          try {
            const createdAt = parseISO(u.createdAt);
            return (
              createdAt.getMonth() === monthDate.getMonth() &&
              createdAt.getFullYear() === monthDate.getFullYear()
            );
          } catch {
            return false;
          }
        }).length;
        
        console.log(
          "User createdAt:",
          users.map((u) => u.createdAt)
        );
        return {
          name: label,
          orders: orderCount,
          users: userCount,
        };
      });

      setDataChart(data);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full p-4 rounded-xl shadow-lg bg-[#121212]">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-white">
        Statistik Pengguna dan Transaksi
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
          <Bar dataKey="users" fill="#8884d8" name="Users" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
