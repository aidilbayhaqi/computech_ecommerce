"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {  logoutUser } from "../services/auth";
import { useAuth } from "../services/authContext";


export const useLogout = (isGoogle = false) => {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      if (isGoogle) {
        await signOut({ callbackUrl: "/" });
      } else {
        await logoutUser(); // Hapus token/session dari backend
        setUser(null); // Clear user dari global context
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return handleLogout;
};