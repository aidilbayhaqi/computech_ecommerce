"use client";
import { useEffect, useState } from "react";
import { currentUser } from "../services/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUp, MoveUpLeft } from "lucide-react";
import CardDashboard from "../components/cardDashboard";
import DashboardChart from "../components/lineChart";
import InteractivePieChart from "../components/pieChart";
import CardDashboard2 from "../components/cardDashboard2";
import { getAllPayment } from "../services/payment";
import { getAllUser } from "../services/user";

const DashboardPage = () => {
  const [user, setUser] = useState([]);
  const [totalPayment, setTotalPayment] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);

  useEffect(() => {
    const fetchPayment = async () => {
      const dataPayment = await getAllPayment();
      const dataUser = await getAllUser();

      setTotalPayment(dataPayment);
      setUser(dataUser.slice(0, 5));

      const totalAmount = dataPayment
        .filter((p) => p.payment_status === "paid")
        .reduce((acc, curr) => acc + Number(curr.gross_amount), 0);

      setTotalPayment(totalAmount);

      const totalSold = dataPayment
        .filter(
          (p) => p.payment_status === "paid" && p.Order && p.Order.OrderItems
        )
        .flatMap((p) => p.Order.OrderItems)
        .reduce((total, item) => total + Number(item.quantity || 0), 0);
      setTotalProduct(totalSold);
    };

    fetchPayment();
  }, []);

  const totalUser = user.length;


  return (
    <div className="flex w-full min-h-dvh bg-primary flex-col mt-3 p-2">
      <div className="w-full items-center flex p-3 bg-[#121212]">
        <div className="w-1/2 gap-3">
          <h1 className="md:text-5xl text-2xl font-bold">SALDO TOTAL ECOMMERCE</h1>
          <p className="md:text-xl text-sm mt-2 text-gray-500">
            Saldo total mulai dari penjualan dan pengeluaran
          </p>
          <p className="text-emerald-500 text-2xl mt-3">
            Rp {totalPayment.toLocaleString("id-ID")}
          </p>
          <div className="flex mt-3 gap-2">
            <span className="flex bg-emerald-500 p-1 rounded-xl">
              <MoveUpLeft />
              5.3%
            </span>
            <span className="flex bg-emerald-500 p-1 rounded-xl">
              Rp.5.000.000
            </span>
          </div>
          <p className="mt-3 text-sm italic text-gray-500">di minggu ini</p>
        </div>
        <div className="w-1/2">
          <Image
            src={"/test.jpg"}
            width={500}
            height={500}
            alt="icon"
            className="w-full object-cover md:h-64 h-32"
          ></Image>
        </div>
      </div>
      <div className="">
        <CardDashboard
          totalPayment={totalPayment}
          totalUsers={totalUser}
          totalSold={totalProduct}
        />
      </div>
      <div className="mt-5 lg:flex grid gap-2 items-center">
        <DashboardChart />
        <InteractivePieChart />
      </div>
      <div className="">
        <CardDashboard2  />
      </div>
    </div>
  );
};

export default DashboardPage;
