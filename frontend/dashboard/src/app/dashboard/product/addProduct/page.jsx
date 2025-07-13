"use client";
import { addProduct } from "@/app/services/product";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

const AddProductPage = () => {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [desc, setDesc] = useState("");
  const [categories, setCategories] = useState("");
  const [types, setTypes] = useState([]);
  const [typeInput, setTypeInput] = useState("");
  const [typePriceInput, setTypePriceInput] = useState("");

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");
  const [preview3, setPreview3] = useState("");

  const addType = () => {
    if (
      typeInput.trim() !== "" &&
      typePriceInput.trim() !== "" &&
      !types.some((t) => t.name === typeInput.trim())
    ) {
      setTypes([
        ...types,
        { name: typeInput.trim(), price: parseInt(typePriceInput) },
      ]);
      setTypeInput("");
      setTypePriceInput("");
    }
  };

  const removeType = (typeToRemove) => {
    setTypes(types.filter((type) => type !== typeToRemove));
  };

  const newProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("desc", desc);
      formData.append("categories", categories);
      formData.append("type", JSON.stringify(types));
      if (image1) formData.append("image", image1);
      if (image2) formData.append("image", image2);
      if (image3) formData.append("image", image3);

      await addProduct(formData)

      Swal.fire({
        icon: "success",
        title: "Product berhasil dibuat!",
        confirmButtonColor: "#6D28D9",
        background: "bg-primary",
      });

      router.push("/dashboard/product");
    } catch (error) {
      if (error.response && error.response.data?.msg) {
        setMsg(error.response.data.msg);
        Swal.fire({
          icon: "error",
          title: "Product gagal ditambahkan!",
          text: error.message,
          confirmButtonColor: "#DC2626",
          background: "#000000",
        });
      } else {
        setMsg("Something went wrong");
        Swal.fire({
          icon: "error",
          title: "ada yang salah!",
          text: error.message,
          confirmButtonColor: "#DC2626",
          background: "#000000",
        });
      }
    }
  };

  const loadImage = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="bg-[#121212] text-white p-6 rounded-xl shadow-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={newProduct} className="space-y-4">
        <input
          className="w-full p-3 rounded bg-[#1e1e1e]"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          required
        />
        <input
          className="w-full p-3 rounded bg-[#1e1e1e]"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          placeholder="Price"
          type="number"
          required
        />
        <input
          className="w-full p-3 rounded bg-[#1e1e1e]"
          name="stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          required
        />
        <select
          name=""
          id=""
          className="w-full p-3 rounded bg-[#1e1e1e]"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
        >
          <option value="">Select Categories</option>
          <option value="PHONE">Phone</option>
          <option value="LAPTOP">Laptop</option>
          <option value="COMPUTERS">Computer</option>
          <option value="SOFTWARE">Software</option>
          <option value="OTHERS">Other</option>
        </select>
        <textarea
          className="w-full p-3 rounded bg-[#1e1e1e]"
          name="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description Product"
          type="number"
          required
        />

        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Product Type
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
              placeholder="Tipe (contoh: SSD 1TB)"
              className="w-full px-4 py-2 rounded bg-[#1e1e1e] text-white"
            />
            <input
              type="number"
              value={typePriceInput}
              onChange={(e) => setTypePriceInput(e.target.value)}
              placeholder="Harga (contoh: 1000000)"
              className="w-1/2 px-4 py-2 rounded bg-[#1e1e1e] text-white"
            />
            <button
              type="button"
              onClick={addType}
              className="bg-blue-600 px-4 rounded text-white"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {types.map((type, index) => (
              <span
                key={index}
                className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {type.name} - Rp {type.price.toLocaleString("id-ID")}
                <button
                  type="button"
                  onClick={() => removeType(type.name)}
                  className="text-red-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label>PRODUCT IMAGE 1</label>
          <input
            type="file"
            onChange={(e) => loadImage(e, setImage1, setPreview1)}
            className="w-full p-3 rounded bg-[#1e1e1e]"
          />
          {preview1 && (
            <Image src={preview1} width={100} height={100} alt="Preview 1" />
          )}
        </div>

        <div>
          <label>PRODUCT IMAGE 2</label>
          <input
            type="file"
            onChange={(e) => loadImage(e, setImage2, setPreview2)}
            className="w-full p-3 rounded bg-[#1e1e1e]"
          />
          {preview2 && (
            <Image src={preview2} width={100} height={100} alt="Preview 2" />
          )}
        </div>

        <div>
          <label>PRODUCT IMAGE 3</label>
          <input
            type="file"
            onChange={(e) => loadImage(e, setImage3, setPreview3)}
            className="w-full p-3 rounded bg-[#1e1e1e]"
          />
          {preview3 && (
            <Image src={preview3} width={100} height={100} alt="Preview 3" />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
