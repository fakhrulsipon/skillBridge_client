"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/NavBar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <Navbar />
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`flex-1 ${isHome ? "" : "pt-24"}`}
      >
        {children}
      </motion.main>
      {!["/login", "/register"].includes(pathname) && <Footer />}
    </div>
  );
};

export default CommonLayout;
