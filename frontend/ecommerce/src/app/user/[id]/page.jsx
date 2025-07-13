"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { getUserById, updateUsers } from "@/app/services/user";
import Swal from "sweetalert2";

export default function EditProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    no_telp: "",
    photo: "",
  });
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.error("Gagal memuat profil", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("address", user.address);
      formData.append("no_hp", user.no_hp);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await updateUsers(user.id, formData); // harus support `multipart/form-data` di backend
      Swal.fire({
        icon: "success",
        title: "Berhasil update data",
        confirmButtonColor: "#6D28D9",
        background: "bg-primary",
      });
      router.push('/')
    } catch (error) {
      console.error("Update gagal", error);
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan update data",
        confirmButtonColor: "#DC2626",
        background: "bg-primary",
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-20 px-6">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Edit Profil
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Foto Profil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Nama
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Alamat
            </label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              No. Telepon
            </label>
            <input
              type="tel"
              name="phone"
              value={user.no_hp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition font-semibold"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
