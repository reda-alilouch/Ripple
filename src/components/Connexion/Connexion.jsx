"use client";
import { useState } from "react";
import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal/Modal";

export default function Connexion() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="connexion">
      <Button
        id="btn-connexion"
        name="Connexion"
        className="border rounded-3xl w-20 h-8 text-xs text-center xl:w-28 xl:h-10 xl:text-sm xl:px-3 hover:shadow dark:text-white dark:hover:shadow-customdark"
        onClick={openModal}
      />

      <Modal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
}

