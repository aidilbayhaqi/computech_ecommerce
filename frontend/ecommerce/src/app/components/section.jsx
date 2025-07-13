import Image from "next/image";
import React from "react";

const Section = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Light mode background */}
      <Image
        src="/sectionlight.png"
        alt="light mode background"
        fill
        className="z-0 block dark:hidden mt-3"
        priority
      />

      {/* Dark mode background */}
      <Image
        src="/sectiondark.png"
        alt="dark mode background"
        fill
        className="z-0 hidden dark:block mt-3"
        priority
      />

      {/* Content */}
      <div className="relative z-10 flex items-start flex-col h-full w-full lg:w-1/2 mt-16 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-gray-950 drop-shadow-md animate-fadeIn">
          Welcome to TechCommerce
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-500 max-w-xl">
          Discover premium tech products in a seamless shopping experience.
        </p>

        <div className="">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:bg-gradient-to-r dark:from-purple-800 dark:to-purple-950 p-3 text-white rounded-xl mt-5 cursor-pointer font-bold">
            lets explore your taste
          </button>
        </div>
      </div>
    </section>
  );
};

export default Section;
