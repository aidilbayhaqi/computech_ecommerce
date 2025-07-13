"use client";
import { loginUser } from "@/app/services/auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
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
        background: "bg-primary",
      });

      router.push("/"); // arahkan ke dashboard setelah login
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
      router.push("/"); // arahkan setelah login
    }
  }, [session]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 py-10">
      <div className="w-full max-w-md bg-black/80 border border-purple-800 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 focus-within:ring-2 ring-purple-500 rounded-xl px-4 py-3 transition">
              <FaUserAlt className="text-purple-400" />
              <input
                type="email"
                name="email"
                onChange={handleLogin}
                required
                placeholder="you@example.com"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 focus-within:ring-2 ring-purple-500 rounded-xl px-4 py-3 transition">
              <FaLock className="text-purple-400" />
              <input
                type="password"
                name="password"
                onChange={handleLogin}
                required
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-900 hover:opacity-90 py-3 rounded-xl font-medium text-white transition shadow-lg"
          >
            Sign In
          </button>
          <div className="flex items-center gap-2 my-4">
            <div className="h-px flex-1 bg-gray-700" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full bg-white text-black font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-lg"
          >
          <FcGoogle size={28}/>
            Sign in with Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-purple-400 hover:underline transition"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
