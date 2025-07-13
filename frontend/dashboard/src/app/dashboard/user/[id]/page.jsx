"use client";

import { getUserById, updateUsers } from "@/app/services/user";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const page = ({ params }) => {
  const router = useRouter();
  const { id } = useParams();
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [oldImages, setOldImages] = useState([]); // dari DB
  const [newImages, setNewImages] = useState([null, null, null]); // untuk ganti sebagian

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await getUserById(id);
        setName(res.name);
        setEmail(res.email)
        setRole(res.role)
        setOldImages(
          res.image?.split(", ").map((img) => `/uploads/${img}`) || []
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);
  
  const handleImageChange = (index, file) => {
    const updatedImages = [...newImages];
    updatedImages[index] = file;
    setNewImages(updatedImages);
  };

  const editUsers = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);

    newImages.forEach((img, i) => {
      if (img) formData.append("image", img);
      else formData.append("image", ""); // biar jumlah tetap 3
    });
    try {
      await updateUsers(id, formData)
      router.push("/dashboard/user");
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#121212] text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="flex gap-5 w-full">
        <form onSubmit={editUsers} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-[#1e1e1e]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            className="w-full p-3 rounded bg-[#1e1e1e]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <input
            className="w-full p-3 rounded bg-[#1e1e1e]"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="role"
            required
          />
          <div className="space-y-2">
            <label className="block font-semibold">Images</label>
            {[0].map((i) => (
              <div key={i} className="flex items-center gap-4 mb-2">
                {oldImages[i] ? (
                  <Image
                    src={`/uploads/${oldImages[i]}`}
                    alt={`image-${i}`}
                    width={100}
                    height={100}
                    className="rounded border"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-800 flex items-center justify-center rounded">
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(i, e.target.files[0])}
                  className="text-sm"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded text-white w-full mt-4"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
