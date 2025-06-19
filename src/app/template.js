"use client";

import Header from "@/features/Header/Header";
import Aside from "@/features/Aside";
import Footer from "@/features/Footer/Footer";
import Audio from "@/features/Audio/Audio";
import { useEffect, useState } from "react";

export default function Template({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen transition-colors duration-1000 dark:bg-slate-900 dark:text-white">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="xl:flex">
        <Aside isOpen={isSidebarOpen} />
        <main className="main w-full" id="main">
          {children}
          <Footer />
        </main>
      </div>
      <Audio />
    </div>
  );
}
