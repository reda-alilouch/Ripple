"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/Button";
import Modal from "@/components/Modal/Modal";
import Link from "next/link";
import axios from "axios";
import Image from "next/image"
export default function Connexion() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleImageUpload = async () => {
    const response = await axios.post("/api/profile/image", {
      image: session?.user?.image,
    });
    console.log(response);
  };

  useEffect(() => {
    if (session?.user?.image) {
      handleImageUpload();
    }
  }, [session]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  const [userImage, setUserImage] = useState(null);
  useEffect(() => {
    const loadUserRole = async () => {
      if (status !== "authenticated" || !session?.user) return;
      try {
        const response = await axios.get("/api/profile/image");
        if (response.data.ok) {
          const data = response.data;
          setUserImage(data.image);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du rôle:", error);
      }
    };

    loadUserRole();
  }, [session, status]);
  useEffect(() => {
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
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
    );
  }

  return (
    <div className="relative connexion">
      {status === "authenticated" && session?.user ? (
        <div className="profile-dropdown">
          <button
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
            <Image
              src={session.user.image || "/default-artist.svg"}
              alt="Profile"
              className="object-cover w-10 h-10 transition-opacity rounded-full cursor-pointer hover:opacity-80"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800">
              <Link
                href="/profil"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowDropdown(false)}
              >
                Profil
              </Link>

              <button
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
