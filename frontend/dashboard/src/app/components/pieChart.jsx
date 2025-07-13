"use client";

import React, { PureComponent, useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { getAllProducts } from "../services/product";
import { getAllPayment } from "../services/payment";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Jumlah: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function ProductPieChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getAllProducts();

        const payments = await getAllPayment();

        const totalStock = products.reduce(
          (acc, curr) => acc + Number(curr.stock),
          0
        );

        const totalSold = payments.reduce((acc, curr) => {
          const items = curr.Order?.OrderItems || [];
          const qty = items.reduce((sum, item) => sum + item.quantity, 0);
          return acc + qty;
        }, 0);

        const chartFormatted = [
          { name: "Produk Terjual", value: totalSold },
          { name: "Produk Tersedia", value: totalStock },
        ];

        setChartData(chartFormatted);
      } catch (err) {
        console.error("Failed fetching chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-96 bg-[#121212] rounded-xl shadow-md">
      <h2 className="text-center font-semibold text-white mt-4">
        Statistik Produk
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
