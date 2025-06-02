"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal/Modal";

export default function Connexion() {
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState(null);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);
  return (
    <div className="connexion">
      {user ? (
        <img
          src={user.profileImage}
          alt="Profil"
          className="object-cover w-10 h-10 rounded-full"
        />
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
