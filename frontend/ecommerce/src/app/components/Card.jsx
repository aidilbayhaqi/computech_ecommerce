"use client";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import Swal from "sweetalert2";

// Dummy data produk

export default function Card() {
  const [cart, setCart] = useState([]);
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Gagal memuat produk</p>;

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
       Swal.fire({
              icon: "success",
              title: "Berhasil menambahkan barang ke cart",
              confirmButtonColor: "#6D28D9",
              background: "bg-primary",
            });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan barang ke cart",
        confirmButtonColor: "#DC2626",
        background: "bg-primary",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Explore Tech Products
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200 dark:border-gray-800 cursor-pointer"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.image[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-40">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-blue-600 dark:text-purple-800 font-bold mt-1">
                    Rp{product.price.toLocaleString("id-ID")}
                  </p>
                </Link>

                <button
                  className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700  text-white py-2 px-4 rounded-xl text-sm font-medium transition"
                  onClick={()=>handleAddToCart(product.id)}
                >
                  <FaShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
