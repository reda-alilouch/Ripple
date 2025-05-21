"use client";
import { useState } from "react";
import Button from "@/src/components/Button";
import Style from "@/src/components/Modal/Modal.css";

const Modal = ({ isOpen, closeModal }) => {
  const [tab, setTab] = useState("sign-in"); // ✅ définir l'état du tab

  if (!isOpen) return null;

  return (
    <div className="login-wrap fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="login-html bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative">
        <input
          id="tab-1"
          type="radio"
          name="tab"
          className="sign-in hidden"
          checked={tab === "sign-in"}
          onChange={() => setTab("sign-in")}
        />
        <label htmlFor="tab-1" className="tab cursor-pointer">
          Sign In
        </label>

        <input
          id="tab-2"
          type="radio"
          name="tab"
          className="sign-up hidden"
          checked={tab === "sign-up"}
          onChange={() => setTab("sign-up")}
        />
        <label htmlFor="tab-2" className="tab cursor-pointer">
          Sign Up
        </label>

        <div className="login-form mt-4">
          {tab === "sign-in" && (
            <div className="sign-in-htm">
              {/* ... formulaire de connexion ... */}
            </div>
          )}
          {tab === "sign-up" && (
            <div className="sign-up-htm">
              {/* ... formulaire d'inscription ... */}
            </div>
          )}
        </div>

        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
