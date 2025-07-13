"use client";
import React, { useEffect, useState } from "react";
import { currentUser, logoutUser } from "../services/auth";
import Image from "next/image";
import Link from "next/link";
import { FaMoneyBill, FaShoppingCart, FaUser } from "react-icons/fa";
import { MdDashboard, MdPending, MdSupervisedUserCircle } from "react-icons/md";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const SideBar = ({ isOpen, setIsOpen }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await currentUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    if (session) {
      signOut({ callbackUrl: "/" });
    } else {
      logoutUser();
      router.push("/");
    }
  };

  const sideButton = [
    { title: "Dashboard", icon: <MdDashboard size={25} />, link: "/dashboard" },
    {
      title: "Users",
      icon: <MdSupervisedUserCircle size={25} />,
      link: "/dashboard/user",
    },
    {
      title: "Product",
      icon: <FaShoppingCart size={25} />,
      link: "/dashboard/product",
    },
    { title: "Order", icon: <MdPending size={25} />, link: "/dashboard/order" },
    {
      title: "Payment",
      icon: <FaMoneyBill size={25} />,
      link: "/dashboard/payment",
    },
    {
      title: "Shipping",
      icon: <Truck size={25} />,
      link: "/dashboard/shipping",
    },
  ];

  const avatarSrc = user?.image?.startsWith("http")
    ? user.image
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user?.image}`;

  return (
    <>
      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 lg:h-full h-screen lg:overflow-hidden overflow-y-auto bg-[#121212] text-white z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:relative lg:w-72 w-64`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold hidden lg:block mb-4">
            Dashboard Ecommerce
          </h1>

          {/* Profile */}
          <div className="">
            <Link
              href={`/dashboard/user/${user?.id}`}
              className="flex flex-wrap gap-2 rounded-lg shadow-lg items-center hover:text-green-600 transition-all hover:scale-105 p-2"
            >
              <Image
                src={avatarSrc || "/profile.png"}
                width={80}
                height={80}
                alt="."
                className="w-[50px] h-[50px] rounded-full overflow-hidden object-cover object-top"
              ></Image>
              <p className="text-sm font-bold">{user?.name}</p>
            </Link>
          </div>

          <div className="flex flex-col w-full mt-2">
            <ul className="">
              {sideButton.map((item, index) => (
                <li
                  className="flex w-full justify-between cursor-pointer gap-5 items-center my-3 p-5 rounded-lg hover:text-green-600 transition-all hover:scale-105"
                  key={index}
                >
                  <Link
                    href={item.link}
                    className="flex w-full gap-3 items-center font-bold"
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={handleLogout}
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded mt-6"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Background overlay (only on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;
