"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "../services/auth";
import SideBar from "../components/SideBar";
import Navbar from "../components/navbar";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await currentUser();
      if (!response) {
        redirect("/");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full flex bg-primary text-white">
      <div className="">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      <div className="flex-1 w-full p-4">
        <Navbar setIsOpen={() => setIsSidebarOpen(true)} />
        <main className="mt-4">{children}</main>
      </div>
    </div>
  );
}
