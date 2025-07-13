"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductById } from "@/app/hooks/useProduct";
import { useCart } from "@/app/hooks/useCart";
import Image from "next/image";
import Swal from "sweetalert2";

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState("cart"); // "cart" atau "buy"

  const router = useRouter();

  const { product, loading } = useProductById(id);
  const { addToCart } = useCart();

  const openModal = (mode) => {
    setActionType(mode); // 'cart' atau 'buy'
    setShowModal(true);
  };
  

  // Normalisasi image jadi array & set default image
  const imageArray = product?.image
    ? Array.isArray(product.image)
      ? product.image
      : product.image
          .split(",")
          .map(
            (img) =>
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${img.trim()}`
          )
    : [];

  useEffect(() => {
    if (imageArray.length > 0 && !selectedImage) {
      setSelectedImage(imageArray[0]);
    }
  }, [product]);

  const parsedTypes = (() => {
    if (typeof product?.type === "string") {
      try {
        return JSON.parse(product.type);
      } catch {
        return [];
      }
    }
    return product?.type || [];
  })();

  const handleTypeChange = (e) => setSelectedType(e.target.value);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
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

  const handleToBuy = () => {
    router.push(`/order?productId=${product.id}`);
  };

  if (loading || !product) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen px-8 pt-20 py-10 dark:bg-black dark:text-white bg-white text-black">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div>
          <div className="border-4 border-purple-600 rounded-xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full object-cover h-[400px] rounded-xl transition duration-300"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4">
            {imageArray.map((img, index) => (
              <Image
                width={500}
                height={500}
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                  selectedImage === img
                    ? "border-purple-500"
                    : "border-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-300 mb-4">{product.desc}</p>
          <p className="text-xl text-green-400 font-semibold mb-4">
            Harga: Rp{" "}
            {(selectedType?.price ?? product.price).toLocaleString("id-ID")}
          </p>

          {/* Pilihan Tipe */}
          <div className="mb-6">
            <label className="block mb-2 text-sm">Pilih Tipe:</label>
            <select
              value={JSON.stringify(selectedType)}
              onChange={(e) => setSelectedType(JSON.parse(e.target.value))}
              className="bg-gray-800 text-white border border-purple-500 rounded-xl px-4 py-2 w-full focus:ring-2 ring-purple-600"
            >
              <option value="">-- Pilih Tipe --</option>
              {parsedTypes.map((item, idx) => (
                <option key={idx} value={JSON.stringify(item)}>
                  {item.name} - Rp {item.price.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-md space-y-4">
                <h2 className="text-xl font-bold text-center mb-4">
                  Konfirmasi Pembelian
                </h2>

                <div>
                  <label className="block mb-1">Pilih Tipe:</label>
                  <select
                    value={JSON.stringify(selectedType)}
                    onChange={(e) =>
                      setSelectedType(JSON.parse(e.target.value))
                    }
                    className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 ring-purple-600"
                  >
                    <option value="">-- Pilih Tipe --</option>
                    {parsedTypes.map((item, idx) => (
                      <option key={idx} value={JSON.stringify(item)}>
                        {item.name} - Rp {item.price.toLocaleString("id-ID")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Jumlah:</label>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded border"
                  />
                </div>

                <div className="flex justify-between gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-400 px-4 py-2 rounded text-white w-full"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      setShowModal(false);
                      if (!selectedType) {
                        Swal.fire("Pilih tipe terlebih dahulu", "", "warning");
                        return;
                      }

                      if (actionType === "cart") {
                        await addToCart(product.id, quantity, selectedType);
                        Swal.fire(
                          "Ditambahkan",
                          "Produk masuk ke keranjang",
                          "success"
                        );
                      } else {
                        router.push(
                          `/order?productId=${product.id}&type=${selectedType}&quantity=${quantity}`
                        );
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white w-full"
                  >
                    Lanjutkan
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="gap-5 items-center flex">
            <button
              onClick={() => openModal("cart")}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white cursor-pointer py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Tambah ke Keranjang
            </button>

            <button
              onClick={() => openModal("buy")}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white cursor-pointer py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
