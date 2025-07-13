import { ShoppingBasket } from 'lucide-react';
import React from 'react'
import { FaShippingFast, FaWallet } from 'react-icons/fa';
import { MdSupervisedUserCircle } from 'react-icons/md';

const cardDashboard = (props) => {
  return (
    <div className="mt-4 md:flex grid gap-4 w-full justify-center">
      <div className="bg-[#121212] p-5 items-center w-full">
        <h1 className="text-3xl font-bold flex gap-3">
          <span>
            <FaWallet />
          </span>
          Total Pemasukan
        </h1>
        <p className="text-emerald-500 mt-3">
          Rp {props.totalPayment.toLocaleString("id-ID")}
        </p>
      </div>
      <div className="bg-[#121212] p-5 items-center w-full">
        <h1 className="text-3xl font-bold flex gap-3 items-center">
          <span>
            <MdSupervisedUserCircle />
          </span>
          Total User
        </h1>
        <p className="text-blue-500 mt-3">{props.totalUsers} user</p>
      </div>
      <div className="bg-[#121212] p-5 items-center w-full">
        <h1 className="text-3xl font-bold flex gap-3 items-center">
          <span>
            <ShoppingBasket />
          </span>
          Produk Terjual
        </h1>
        <p className="text-orange-500 mt-3">{props.totalSold} Produk</p>
      </div>
    </div>
  );
}

export default cardDashboard