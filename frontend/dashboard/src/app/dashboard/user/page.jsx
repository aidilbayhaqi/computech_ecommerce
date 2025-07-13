"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteUser, getAllUser } from "@/app/services/user";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const itemsPerPage = 5;

  const fetchUser = async () => {
    const data = await getAllUser();
    setUsers(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  console.log(users);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
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
          await deleteUser(id);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          fetchUser();
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
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-md bg-[#2c2c2e] text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-[#1e1e1e] text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left bg-[#2a2a2a]">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Avatar</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr
                key={user.id || index}
                className="border-t border-[#2a2a2a] hover:bg-[#2c2c2c]"
              >
                <td className="px-4 py-2">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="px-4 py-2">
                  {user && user.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user?.image}`}
                      alt={""}
                      width={100}
                      height={100}
                      className="w-[50px] h-[50px] rounded-full overflow-hidden object-cover object-top"
                    />
                  ) : (
                    <Image
                      src={"/profile.png"}
                      alt={``}
                      width={100}
                      height={100}
                      className="w-[50px] h-[50px] rounded-full overflow-hidden object-cover object-top"
                    />
                  )}
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="">
                  <div className="space-x-2 flex items-center">
                    <span className="bg-blue-600 px-3 py-1 rounded">
                      <Link href={`/dashboard/user/${user.id}`}>
                        <FaEdit size={20} />
                      </Link>
                    </span>
                    <button
                      className="bg-red-600 px-3 py-1 rounded cursor-pointer"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
              prev * itemsPerPage < filteredUsers.length ? prev + 1 : prev
            )
          }
          className="bg-gray-700 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
