"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2"; // pastikan Swal diimport
import { registerUser } from "../services/auth";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    avatar: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ⛔ WAJIB supaya form tidak reload
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      const response = await registerUser(data);
      await Swal.fire({
        icon: "success",
        title: "Register Berhasil!",
        text: "Selamat datang Admin",
        confirmButtonColor: "#6D28D9",
        background: "#000000",
      });
      router.push("/"); // akan jalan setelah alert ditutup
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Register Gagal!",
        text: error?.response?.data?.message || error.message,
        confirmButtonColor: "#DC2626",
        background: "#000000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-primary items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-lg shadow-lg neon-border border text-white p-6">
        <h1 className="text-xl font-bold text-center">REGISTER ADMIN</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 rounded bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 rounded bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 rounded bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="w-full mt-1 text-white"
            />
          </div>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-white font-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register sebagai admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
