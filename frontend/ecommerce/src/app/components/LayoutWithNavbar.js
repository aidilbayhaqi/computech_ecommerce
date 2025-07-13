"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function LayoutWithNavbar({ children }) {
  const pathname = usePathname();

  // Daftar path di mana Navbar tidak muncul
  const hideNavbarOn = ["/login", "/register"];

  // Periksa apakah path saat ini ada di daftar tersebut
  const shouldHideNavbar = hideNavbarOn.includes(pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
}
