"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal/Modal";
import Link from "next/link";

export default function Connexion() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");
  const [showDropdown, setShowDropdown] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" }); // Route personnalisée pour déconnexion
      setSession(null); // Effacer la session côté client
      window.location.href = "/"; // Rediriger vers la page d'accueil
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la session :", error);
        setStatus("unauthenticated");
      }
    };
    fetchSession();

    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".profile-dropdown")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (status === "loading") {
    return (
      <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <div className="connexion relative">
      {status === "authenticated" && session?.user ? (
        <div className="profile-dropdown">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <img
              src={session.user.image || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
              <Link
                href="/profil"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Profil
              </Link>

              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button
          id="btn-connexion"
          name="Connexion"
          className="w-20 h-8 text-xs text-center border rounded-3xl xl:w-28 xl:h-10 xl:text-sm xl:px-3 hover:shadow dark:text-white dark:hover:shadow-customdark"
          onClick={openModal}
        />
      )}

      <Modal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
}
