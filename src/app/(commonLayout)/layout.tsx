"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/NavBar";
import { usePathname } from "next/navigation";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-24"}`}>
        {children}
      </main>
      {!["/login", "/register"].includes(pathname) && <Footer />}
    </div>
  );
};

export default CommonLayout;
