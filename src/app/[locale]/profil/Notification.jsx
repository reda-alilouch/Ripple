"use client";
import { useState, useEffect } from "react";
import Icon from "@/components/Icon";

const Notification = ({ message, type = "info", onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Attendre l'animation de sortie
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fa-check-circle";
      case "error":
        return "fa-exclamation-circle";
      case "warning":
        return "fa-exclamation-triangle";
      default:
        return "fa-info-circle";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-[#ff4545]";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-[#ff4545]";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${getBgColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80`}
      >
        <Icon lib="fa-solid" name={getIcon()} className="text-lg" />
        <span className="flex-1">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <Icon lib="fa-solid" name="fa-times" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
