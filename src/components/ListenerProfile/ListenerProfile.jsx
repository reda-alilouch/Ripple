import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import axios from "axios";

const ListenerProfile = ({ userData }) => {
  const [profileImage, setProfileImage] = useState(
    userData.image || "/default-artist.svg"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation type et taille
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setNotification({ type: "error", message: "Format non supporté" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: "error",
        message: "Image trop lourde (max 5Mo)",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target.result;
      setProfileImage(imageData);

      // Envoi à l'API
      try {
        const res = await axios.post("/api/profile/image", {
          image: imageData,
        });
        const data = res.data;
        if (data.success) {
          setNotification({ type: "success", message: "Photo mise à jour !" });
        } else {
          setNotification({
            type: "error",
            message: data.error || "Erreur serveur",
          });
        }
      } catch {
        setNotification({ type: "error", message: "Erreur réseau" });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#ff4545] shadow-lg">
        <Image
          src={profileImage}
          alt="Photo de profil"
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
        <label className="absolute bottom-2 right-2 bg-[#ff4545] text-white p-2 rounded-full cursor-pointer hover:bg-[#ff6666] transition">
          <Icon
            lib="fa-solid"
            name={isUploading ? "fa-spinner" : "fa-camera"}
            className={isUploading ? "animate-spin" : ""}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </label>
      </div>
      {notification && (
        <div
          className={`mt-2 px-4 py-2 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}
      {/* ...autres infos du profil... */}
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
          {userData.name || "Utilisateur"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {userData.email || "email@example.com"}
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {(userData.listenerProfile?.favoriteGenres || []).map(
            (genre, idx) => (
              <span
                key={idx}
                className="bg-[#ff4545]/10 text-[#ff4545] dark:bg-[#ff4545]/20 dark:text-white px-3 py-1 rounded-full text-xs font-medium"
              >
                {genre}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ListenerProfile;
