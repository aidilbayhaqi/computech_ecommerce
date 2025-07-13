'use client'
import React, { useEffect, useState } from 'react'
import { currentUser } from '../services/auth'
import { FaSearch } from 'react-icons/fa'
import { HiMenuAlt2 } from 'react-icons/hi' // icon open


const navbar = ({ setIsOpen }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await currentUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full flex justify-between rounded-lg bg-[#121212] px-3 py-2">
      <div className="font-2xl font-bold">Welcome {user?.name}</div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="lg:hidden block"
      >
        <HiMenuAlt2 size={24} />
      </button>
    </div>
  );
};

export default navbar