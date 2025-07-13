"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/product?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 hover:bg-blue-700 cursor-pointer dark:hover:bg-purple-700 text-white rounded-md transition"
        >
          Search
        </button>
      </form>
    </section>
  );
};

export default SearchBar;
