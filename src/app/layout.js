"use client";

import Header from "@/src/features/Header/Header";
import Aside from "@/src/features/Aside";
import Footer from "@/src/features/Footer/Footer";
import Audio from "@/src/features/Audio/Audio";

import "./global.css";

import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  //dark mode

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
    <html lang="en" className="dark">
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
        />
      </head>
      <body className="transition-colors duration-1000 dark:bg-slate-900 dark:text-white"> 
        <Header onToggleSidebar={toggleSidebar} />
        <div className="xl:flex">
          <Aside isOpen={isSidebarOpen} />
          <main className="main" id="main">
            {children}
            <Footer />
          </main>
        </div>
        <Audio />
      </body>
    </html>
  );
}
