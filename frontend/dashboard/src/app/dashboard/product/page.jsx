"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { deleteProduct, getAllProducts } from "@/app/services/product";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    const data = await getAllProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter logic
  const filteredProducts = products.filter(
    (product) =>
      (product.name?.toLowerCase().includes(search.toLowerCase()) ?? false) &&
      (category === "all" || product.categories === category)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const deleteProducts = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteProduct(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        fetchProducts();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "gagal menghapus product",
          text: error.message || "gagal menghapus product",
        });
      }
    }
  };

  return (
    <div className="text-white p-4 bg-[#121212] min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-[#2c2c2e] p-2 rounded text-white"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/product/addProduct"
            className="bg-green-600 px-4 py-2 rounded"
          >
            + Add Product
          </Link>
          <select
            className="bg-[#2c2c2e] p-2 rounded text-white"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="PHONE">PHONE</option>
            <option value="COMPUTER">COMPUTER</option>
            <option value="SOFTWARE">SOFTWARE</option>
            <option value="LAPTOP">LAPTOP</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-[#2c2c2e] text-gray-300">
          <tr>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-700 hover:bg-[#2a2a2e]"
              >
                <td className="py-3 px-4">
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded object-cover"
                  />
                </td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">
                  Rp {product.price?.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4">{product.stock}</td>
                <td className="py-3 px-4">{product.categories}</td>
                <td className="">
                  <div className="space-x-2 flex items-center">
                    <span className="bg-blue-600 px-3 py-1 rounded">
                      <Link href={`/dashboard/product/${product.id}`}>
                        <FaEdit size={20} />
                      </Link>
                    </span>
                    <button
                      className="bg-red-600 px-3 py-1 rounded cursor-pointer"
                      onClick={() => deleteProducts(product.id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-700 px-3 py-1 rounded"
        >
          Prev
        </button>
        <span className="self-center">Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev * itemsPerPage < filteredProducts.length ? prev + 1 : prev
            )
          }
          className="bg-gray-700 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
