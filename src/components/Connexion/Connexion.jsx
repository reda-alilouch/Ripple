"use client";
import { useState } from "react";
import Button from "@/components/Button";

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

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Deactivate account
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to deactivate your account? All your data
              will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
                Deactivate
              </button>
              <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
