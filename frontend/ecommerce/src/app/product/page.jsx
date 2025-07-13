"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useProducts } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const { products } = useProducts();

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchInput, setSearchInput] = useState("");

  const {addToCart}=useCart()

  useEffect(() => {
    let result = products;

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(
        (p) => p.categories && p.categories.toLowerCase() === category.toLowerCase()
      );
    }

    if (type) {
      result = result.filter(
        (p) => p.type.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredProducts(result);
  }, [search, category, type, products]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `?search=${searchInput}`;
  };

  return (
    <div className="flex w-full min-h-screen pt-20 px-8 dark:bg-black dark:text-white bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 pr-8 hidden md:block">
        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none"
          />
        </form>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <ul className="space-y-1">
            <li>
              <Link href="?category=laptop" className="hover:underline">
                Laptop
              </Link>
            </li>
            <li>
              <Link href="?category=Phone" className="hover:underline">
                Phone
              </Link>
            </li>
            <li>
              <Link href="?category=Computers" className="hover:underline">
                Computers
              </Link>
            </li>
            <li>
              <Link href="?category=Software" className="hover:underline">
                Software
              </Link>
            </li>
            <li>
              <Link href="?category=Other" className="hover:underline">
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Type</h3>
          <ul className="space-y-1">
            <li>
              <Link href="?type=Gaming" className="hover:underline">
                Gaming
              </Link>
            </li>
            <li>
              <Link href="?type=Business" className="hover:underline">
                Business
              </Link>
            </li>
            <li>
              <Link href="?type=Student" className="hover:underline">
                Student
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Product Section */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">
          {search
            ? `Search Results for "${search}"`
            : category
            ? `Category: ${category}`
            : type
            ? `Type: ${type}`
            : "All Products"}
        </h1>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
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
                    className="mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-purple-800 dark:to-purple-950 hover:brightness-110 text-white py-2 px-4 rounded-xl text-sm font-medium transition"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <FaShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
