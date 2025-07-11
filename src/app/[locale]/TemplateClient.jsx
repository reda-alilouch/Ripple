"use client";

import tracks from "@/hooks/useSpotifyPlayer"
import playlistId from "@/hooks/useSpotifyPlayer"
import Header from "@/features/Header/Header";
import Aside from "@/features/Aside";
import Footer from "@/features/Footer/FooterClient";
import Audio from "@/features/Audio/Audio";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function TemplateClient({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const locale = params.locale;

  useEffect(() => {
    // La gestion de la classe `dark` est gérée par next-themes.
    // Nous gardons ce `useEffect` uniquement pour le `setMounted`,
    // qui évite les erreurs d'hydratation pour les composants dépendants du thème.
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen duration-1000 wtransition-colors dark:bg-slate-900 dark:text-white">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="xl:flex">
        <Aside isOpen={isSidebarOpen} locale={locale} />
        <main className="w-full main py-24" id="main">
          {children}
          <Footer />
        </main>
      </div>
      {session && <Audio tracks={tracks} playlistId={playlistId} />}
    </div>
  );
}
