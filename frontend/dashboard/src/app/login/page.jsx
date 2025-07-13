"use client";
import { signIn } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { loginUser } from '../services/auth';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaGoogle, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";

const Login = () => {
  const router = useRouter();
  const { data: session, } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser(formData);

      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Selamat datang kembali!",
        confirmButtonColor: "#6D28D9",
        background:'bg-primary'
      });

      router.push("/dashboard"); // arahkan ke dashboard setelah login
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal!",
        text: error.message,
        confirmButtonColor: "#DC2626",
        background: "#000000",
        
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // arahkan setelah login
    }
  }, [session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md p-6 bg-[#1a1a1a] rounded-lg shadow-lg neon-border border text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          method="POST"
          action="/login"
        >
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleLogin}
              required
              className="w-full px-4 py-2 mt-1 rounded bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleLogin}
              required
              className="w-full px-4 py-2 mt-1 rounded bg-black text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="********"
            />
          </div>
          <p>
            Dont have admin account?{" "}
            <Link href={"/register"} className="text-purple-600">
              Lets Register
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-white font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
