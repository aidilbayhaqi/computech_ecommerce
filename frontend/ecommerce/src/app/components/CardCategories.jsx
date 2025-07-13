"use client";
import Link from "next/link";

const categories = [
  { name: "Laptop", image: "/laptopcat.jpg" },
  { name: "Phone", image: "/hpcat.jpg" },
  { name: "Accessories", image: "/other.jpg" },
  { name: "PC", image: "/PCcat.jpg" },
];

const CategoryCard = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/product?category=${cat.name.toLowerCase()}`}
            className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <div className="relative h-32 sm:h-40">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-lg">
                {cat.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryCard;
