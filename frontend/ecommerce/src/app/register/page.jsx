"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaEnvelope, FaUserAlt, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    console.log("Register with:", form);
    // Kirim data ke backend untuk register
  };

  const handleGoogleRegister = async () => {
    await signIn("google", { callbackUrl: "/" }); // Redirect setelah login berhasil
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 py-10">
      <div className="w-full max-w-md bg-black/80 border border-purple-800 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">
          Create Account
        </h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleRegister}
          className="flex items-center justify-center w-full gap-2 bg-white text-black py-3 rounded-xl font-medium shadow-md hover:shadow-lg mb-6 transition"
        >
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 focus-within:ring-2 ring-purple-500 rounded-xl px-4 py-3">
              <FaUserAlt className="text-purple-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 focus-within:ring-2 ring-purple-500 rounded-xl px-4 py-3">
              <FaEnvelope className="text-purple-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 focus-within:ring-2 ring-purple-500 rounded-xl px-4 py-3">
              <FaLock className="text-purple-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Confirm Password</label>
            <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 focus-within:ring-2 ring-purple-500 rounded-xl px-4 py-3">
              <FaLock className="text-purple-400" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
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
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:underline transition"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
