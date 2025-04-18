"use client";

import Header from "@/features/Header/Header";
import Aside from "@/features/Aside";
import Footer from "@/features/Footer/footer";
import Audio from "@/features/Audio/Audio";
import Carousel from "@/components/Carousel";
import "./global.css";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  return (
    <html lang="en">
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
      <body>
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Aside isOpen={isSidebarOpen} />
          <main className="main" id="main">
            {children}
            <Carousel />
            <Footer />
          </main>
        </div>
        <Audio />
      </body>
    </html>
  );
}
