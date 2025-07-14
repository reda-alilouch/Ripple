"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import styles from "./profil.module.css";
import Notification from "./Notification";
import RoleSelector from "@/components/RoleSelector/RoleSelector";
import ArtistDashboard from "@/components/ArtistDashboard/ArtistDashboard";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

const ProfilClient = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("historique");
  const [bannerImage, setBannerImage] = useState(userData.bannerImage || null);
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const bannerInputRef = useRef(null);

  // Ajout de la session NextAuth côté client
  const { data: session, status } = useSession
    ? useSession()
    : { data: null, status: "loading" };

  // Charger le rôle de l'utilisateur UNIQUEMENT quand la session est prête
  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const loadUserRole = async () => {
      try {
        const response = await axios.get("/api/user/role");
        if (response.data.ok) {
          const data = response.data;
          setUserRole(data.role);
          if (data.role === "listener" && !data.hasProfile) {
            setShowRoleSelector(true);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du rôle:", error);
      }
    };
    loadUserRole();
  }, [session, status]);

  // Données fictives pour l'historique et les recommandations
  const historique = [
    {
      id: 1,
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      image: "/default-album.jpg",
      playedAt: "Il y a 2 heures",
    },
    {
      id: 2,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      image: "/default-album.jpg",
      playedAt: "Il y a 4 heures",
    },
    {
      id: 3,
      title: "Dance Monkey",
      artist: "Tones and I",
      album: "The Kids Are Coming",
      image: "/default-album.jpg",
      playedAt: "Hier",
    },
  ];

  const playlists = [
    {
      id: 1,
      name: "Mes favoris",
      image: "/default-playlist.svg",
      tracks: 24,
    },
    {
      id: 2,
      name: "Workout",
      image: "/default-playlist.svg",
      tracks: 18,
    },
    {
      id: 3,
      name: "Chill",
      image: "/default-playlist.svg",
      tracks: 32,
    },
  ];

  const artistesFavoris = [
    {
      id: 1,
      name: "Ed Sheeran",
      image: "/default-artist.svg",
      followers: "45M",
    },
    {
      id: 2,
      name: "The Weeknd",
      image: "/default-artist.svg",
      followers: "38M",
    },
    {
      id: 3,
      name: "Dua Lipa",
      image: "/default-artist.svg",
      followers: "52M",
    },
  ];

  const stats = {
    totalEcoutes: 1247,
    heuresEcoutees: 89,
    artistesDecouverts: 156,
    playlistsCreees: 8,
  };

  // Fonction pour gérer la sélection de rôle
  const handleRoleSelected = (role) => {
    setUserRole(role);
    setShowRoleSelector(false);
    setNotification({
      message: `Profil ${
        role === "artist" ? "artiste" : "auditeur"
      } créé avec succès !`,
      type: "success",
    });
  };

  // Fonction de test pour vérifier le rôle
  const testUserRole = async () => {
    try {
      const response = await axios.get("/api/user/role");
      const data = response.data;
      setNotification({
        message: `Rôle actuel: ${data.role || "Non défini"}`,
        type: "info",
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du rôle:", error);
      setNotification({
        message: "Erreur lors de la vérification du rôle",
        type: "error",
      });
    }
  };

  // Handler pour la photo de profil
  const handleProfileImageChange = async (e) => {
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
      try {
        const response = await axios.post(
          "/api/profile/image",
          { image: imageData },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = response.data;
        if (data.success) {
          setNotification({ type: "success", message: "Photo mise à jour !" });
          // Rafraîchir la session NextAuth pour mettre à jour l'image partout
          if (typeof update === "function") {
            await update();
          } else {
            await signOut({ redirect: false });
            window.location.reload();
          }
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

  // Handler pour l'upload de la bannière
  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
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
    reader.onload = async (e) => {
      const imageData = e.target.result;
      setBannerImage(imageData);
      setShowBannerUpload(false);
      try {
        const response = await axios.post(
          "/api/profile/banner",
          { bannerImage: imageData },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.data.ok) {
          setNotification({
            message: "Erreur lors de la sauvegarde de la bannière",
            type: "error",
          });
        } else {
          setNotification({
            message: "Bannière mise à jour avec succès !",
            type: "success",
          });
        }
      } catch (error) {
        setNotification({
          message: "Erreur lors de la sauvegarde",
          type: "error",
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler pour supprimer la bannière
  const handleRemoveBanner = async () => {
    setBannerImage(null);
    try {
      const response = await axios.delete("/api/profile/banner");
      if (!response.data.ok) {
        setNotification({
          message: "Erreur lors de la suppression de la bannière",
          type: "error",
        });
      } else {
        setNotification({
          message: "Bannière supprimée avec succès !",
          type: "success",
        });
      }
    } catch (error) {
      setNotification({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    }
  };

  // Affichage conditionnel selon le rôle
  if (!userRole || (userRole !== "artist" && userRole !== "listener")) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center">
        <RoleSelector onRoleSelected={handleRoleSelected} onClose={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Afficher le tableau de bord artiste si l'utilisateur est un artiste */}
      {userRole === "artist" ? (
        <ArtistDashboard artistData={userData} />
      ) : (
        <>
          {/* Banner */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            {/* Image de bannière ou couleur par défaut */}
            {bannerImage ? (
              <div className="absolute inset-0">
                <Image
                  src={bannerImage}
                  alt="Bannière de profil"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#ff4545]">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}

            {/* Contrôles de la bannière */}
            <div className="absolute top-4 right-4 flex gap-2">
              <label
                htmlFor="banner-upload-input"
                className="absolute z-10 top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors cursor-pointer"
              >
                <Icon lib="fa-solid" name="fa-camera" className="text-sm" />
              </label>
              <input
                id="banner-upload-input"
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                onChange={handleBannerUpload}
                className="hidden"
              />
              {bannerImage && (
                <button
                  onClick={handleRemoveBanner}
                  className="bg-red-500/80 hover:bg-red-600 text-white absolute z-10 top-2 right-10 p-2 rounded-full transition-colors"
                  title="Supprimer la bannière"
                >
                  <Icon lib="fa-solid" name="fa-trash" className="text-sm" />
                </button>
              )}
            </div>

            {/* Contenu central du banner */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  Mon Profil
                </h1>
                <p className="text-xl opacity-90">
                  Découvrez votre univers musical
                </p>
              </div>
            </div>
          </div>

          {/* Photo de profil et infos */}
          <div className="relative -mt-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/20 rounded-3xl p-6 md:p-8 shadow-xl dark:shadow-2xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Photo de profil */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-black/20 dark:border-white/30 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                      <Image
                        src={
                          session?.user?.image ||
                          userData.image ||
                          "/default-artist.svg"
                        }
                        alt="Photo de profil"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="profile-upload-input"
                      className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors cursor-pointer"
                    >
                      <Icon
                        lib="fa-solid"
                        name="fa-camera"
                        className="text-sm"
                      />
                    </label>
                    <input
                      id="profile-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Informations utilisateur */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {userData.name ||
                        userData.email?.split("@")[0] ||
                        "Utilisateur"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {userData.email || "email@example.com"}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ff4545]">
                          {stats.totalEcoutes}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Écoutes
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ff4545]">
                          {stats.heuresEcoutees}h
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Écoute
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ff4545]">
                          {stats.artistesDecouverts}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Artistes
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#ff4545]">
                          {stats.playlistsCreees}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Playlists
                        </div>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button className="bg-[#ff4545] hover:bg-[#ff6666] text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg">
                        <Icon lib="fa-solid" name="fa-edit" />
                        Modifier le profil
                      </button>

                      {/* Bouton Devenir Artiste - affiché si pas encore artiste */}
                      {(userRole === "listener" || !userRole) && (
                        <button
                          onClick={() => setShowRoleSelector(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:transform hover:translate-y-[-2px] hover:shadow-lg"
                        >
                          <Icon lib="fa-solid" name="fa-microphone" />
                          Devenir Artiste
                        </button>
                      )}

                      <button className="bg-transparent border border-black/30 dark:border-white/30 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:transform hover:translate-y-[-2px]">
                        <Icon lib="fa-solid" name="fa-share" />
                        Partager
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "historique", label: "Historique", icon: "fa-history" },
                { id: "playlists", label: "Mes Playlists", icon: "fa-list" },
                { id: "artistes", label: "Artistes Favoris", icon: "fa-heart" },
                {
                  id: "statistiques",
                  label: "Statistiques",
                  icon: "fa-chart-bar",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#ff4545] text-white shadow-lg"
                      : "bg-black/10 dark:bg-white/10 text-black dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 hover:transform hover:translate-y-[-2px]"
                  }`}
                >
                  <Icon lib="fa-solid" name={tab.icon} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/20 rounded-2xl p-6 shadow-xl">
              {activeTab === "historique" && (
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                    Historique d'écoute
                  </h3>
                  <div className="space-y-4">
                    {historique.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 hover:transform hover:translate-x-1 hover:border-[#ff4545]/50"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={track.image}
                            alt={track.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-black dark:text-white truncate">
                            {track.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                            {track.artist} • {track.album}
                          </p>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {track.playedAt}
                        </div>
                        <button className="text-[#ff4545] hover:text-[#ff6666]">
                          <Icon lib="fa-solid" name="fa-play" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "playlists" && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Mes Playlists
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 hover:transform hover:translate-y-[-5px] hover:shadow-xl"
                      >
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={playlist.image}
                            alt={playlist.name}
                            width={300}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-black dark:text-white mb-2">
                          {playlist.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {playlist.tracks} titres
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "artistes" && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Artistes Favoris
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artistesFavoris.map((artiste) => (
                      <div
                        key={artiste.id}
                        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 text-center transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 hover:transform hover:scale-105"
                      >
                        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                          <Image
                            src={artiste.image}
                            alt={artiste.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-black dark:text-white mb-2">
                          {artiste.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {artiste.followers} abonnés
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "statistiques" && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Statistiques détaillées
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6">
                      <h4 className="text-lg font-medium text-black dark:text-white mb-4">
                        Top Genres
                      </h4>
                      <div className="space-y-3">
                        {[
                          { genre: "Pop", percentage: 35 },
                          { genre: "Hip-Hop", percentage: 25 },
                          { genre: "Rock", percentage: 20 },
                          { genre: "Électronique", percentage: 15 },
                          { genre: "Jazz", percentage: 5 },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.genre}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div
                                  className="h-2 bg-[#ff4545] rounded-full transition-all duration-500"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-black dark:text-white text-sm w-8">
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-lg p-6 ${styles.statsCard}`}>
                      <h4 className="text-lg font-medium text-white mb-4">
                        Activité récente
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Cette semaine</span>
                          <span className="text-white">12h 34m</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Ce mois</span>
                          <span className="text-white">89h 12m</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Cette année</span>
                          <span className="text-white">1,247h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

          {/* Sélecteur de rôle */}
          {showRoleSelector && (
            <RoleSelector
              onRoleSelected={handleRoleSelected}
              onClose={() => setShowRoleSelector(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfilClient;
