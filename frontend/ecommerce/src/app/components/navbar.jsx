"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import DarkModeToggle from "./darkMode";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useLogout } from "../hooks/useLogout";
import { useAuth } from "../services/authContext";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const session = useSession();

  const logout = useLogout(!!user?.image?.includes("googleusercontent"));

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed w-full z-50 justify-between backdrop-blur-md bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-gray-800 dark:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            TechStore
          </Link>
        </div>

        {/* Center: Menu (desktop) */}
        <div className="hidden md:flex gap-6 text-sm items-center justify-center ml-5 font-medium text-gray-800 dark:text-white">
          <Link href="/" className="hover:text-blue-500 dark:hover:text-purple-800 cursor-pointer transition">Home</Link>
          <Link href="/product" className="hover:text-blue-500 dark:hover:text-purple-800 cursor-pointer transition">Products</Link>
          <Link href="/payment"className="hover:text-blue-500 dark:hover:text-purple-800 cursor-pointer transition">Payment</Link>
          <Link href="/shipping"className="hover:text-blue-500 dark:hover:text-purple-800 cursor-pointer transition">Shipping</Link>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <Link href="/cart">
            <FaShoppingCart
              size={20}
              className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-purple-800 transition"
              title="Cart"
            />
          </Link>
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 cursor-pointer rounded-full overflow-hidden border-2 dark:border-purple-800 border-blue-500"
                >
                  <Image
                    src={
                      user.image
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user.image}` // Manual login
                        : "/profile.png" // fallback
                    }
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60  bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700  text-white rounded-xl shadow-xl p-4 z-50 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={
                          `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user.image}` ||
                          `/profile.png`
                        }
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-white">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href={`/user/${user?.id}`}
                        className="block text-white hover:underline"
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left text-red-500 hover:underline"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className=" bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700  text-white px-4 py-2 rounded-xl font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden grid mt-3 px-4 py-2 space-y-2 text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/products" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          <Link href="/transactions" onClick={() => setIsMenuOpen(false)}>
            Transactions
          </Link>
          <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
            Orders
          </Link>

          {/* Search in Mobile */}
          <form onSubmit={handleSearch} className="pt-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm focus:outline-none"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;
