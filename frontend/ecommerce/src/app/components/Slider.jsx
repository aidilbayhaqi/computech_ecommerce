"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { useProducts } from "../hooks/useProduct";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import Swal from "sweetalert2";

// Dummy data New Arrivals

export default function SliderCarousel() {
  const [cart, setCart] = useState([]);
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

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
    <div className="bg-gray-100 dark:bg-black py-10 px-6">
      <h2 className="text-2xl text-center font-bold text-gray-800 dark:text-white mb-6">
        New Arrivals
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10 relative text-white"
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition">
              <div className="relative w-full h-48">
                <Image
                  src={item.image[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-40">
                <Link href={`/product/${item.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 dark:text-purple-800 font-bold mt-1">
                    Rp{item.price.toLocaleString("id-ID")}
                  </p>
                </Link>

                <button
                  className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700  text-white py-2 px-4 rounded-xl text-sm font-medium transition"
                  onClick={() => handleAddToCart(item.id)}
                >
                  <FaShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
