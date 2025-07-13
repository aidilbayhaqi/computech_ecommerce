"use client";
import { getProductById, updateProduct } from "@/app/services/product";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState("");
  const [types, setTypes] = useState([]);
  const [typeName, setTypeName] = useState("");
  const [typePrice, setTypePrice] = useState("");

  const [oldImages, setOldImages] = useState([]); // URL gambar dari database
  const [newImages, setNewImages] = useState([null, null, null]); // gambar baru yg dipilih

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        const data = res.products;
        setName(data.name);
        setPrice(data.price);
        setStock(data.stock);
        setDesc(data.desc);
        setCategories(data.categories);

        // pecah string image jadi array url
        const urls = data.image
          ? data.image
              .split(", ")
              .map((img) => `http://localhost:5000/public/uploads/${img}`)
          : [];
        setOldImages(urls);

        setTypes(() => {
          try {
            const parsed = JSON.parse(data.type || "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return [];
          }
        });
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchProduct();
  }, [id]);


  const addType = () => {
    if (!typeName || !typePrice) return;
    setTypes([...types, { name: typeName.trim(), price: parseInt(typePrice) }]);
    setTypeName("");
    setTypePrice("");
  };

  const removeType = (index) => {
    const updated = [...types];
    updated.splice(index, 1);
    setTypes(updated);
  };


  const handleImageChange = (index, file) => {
    const updated = [...newImages];
    updated[index] = file;
    setNewImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("desc", desc);
    formData.append("categories", categories);
    formData.append("type", JSON.stringify(types));

    newImages.forEach((file) => {
      formData.append("image", file || ""); // jaga panjang tetap 3
    });

    try {
      await updateProduct(id, formData);
      router.push("/dashboard/product");
    } catch (err) {
      setMsg(err.response?.data?.message || "Gagal update produk");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>
      {msg && <p className="text-red-500">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded bg-[#1e1e1e]"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-3 rounded bg-[#1e1e1e]"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className="w-full p-3 rounded bg-[#1e1e1e]"
          placeholder="Stok"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <textarea
          className="w-full p-3 rounded bg-[#1e1e1e]"
          placeholder="Deskripsi"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />

        <select
          className="w-full p-3 rounded bg-[#1e1e1e]"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          required
        >
          <option value="">Pilih Kategori</option>
          <option value="PHONE">Phone</option>
          <option value="LAPTOP">Laptop</option>
          <option value="COMPUTERS">Computer</option>
          <option value="SOFTWARE">Software</option>
          <option value="OTHERS">Others</option>
        </select>

        <div className="mt-4">
          <label className="font-semibold block mb-2">Tipe Produk</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nama Tipe"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              className="flex-1 p-2 rounded bg-[#1e1e1e]"
            />
            <input
              type="number"
              placeholder="Harga"
              value={typePrice}
              onChange={(e) => setTypePrice(e.target.value)}
              className="w-32 p-2 rounded bg-[#1e1e1e]"
            />
            <button
              type="button"
              onClick={addType}
              className="bg-blue-600 px-4 text-white rounded"
            >
              Tambah
            </button>
          </div>
          <div className="space-y-1">
            {types.map((t, i) => (
              <div
                key={i}
                className="flex justify-between bg-[#1e1e1e] p-2 rounded"
              >
                <span>
                  {t.name} - Rp {t.price.toLocaleString("id-ID")}
                </span>
                <button
                  type="button"
                  onClick={() => removeType(i)}
                  className="text-red-500"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="font-semibold block">Gambar Produk</label>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              {newImages[i] ? (
                <Image
                  src={URL.createObjectURL(newImages[i])}
                  alt={`Preview ${i}`}
                  width={100}
                  height={100}
                  className="rounded border"
                  unoptimized
                />
              ) : oldImages[i] ? (
                <Image
                  src={`/${oldImages[i]}`}
                  alt={`Gambar lama ${oldImages[i]}`}
                  width={100}
                  height={100}
                  className="rounded border"
                  unoptimized
                />
              ) : (
                <div className="w-[100px] h-[100px] bg-gray-700 flex items-center justify-center rounded">
                  No Image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(i, e.target.files[0])}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white mt-6"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
