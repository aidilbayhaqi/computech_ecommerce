'use client'
import React, { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="items-center">
      <button
        className={`text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-purple-800 cursor-pointer transition py-2`}
        onClick={toggleDarkMode}
      >
        {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
      </button>
    </div>
  );
};

export default DarkModeToggle;
