"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";

const ArtistDashboard = ({ artistData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [bannerImage, setBannerImage] = useState(
    artistData?.bannerImage || "/default-banner.jpg"
  );
  const [profileImage, setProfileImage] = useState(
    artistData?.image || "/default-artist.svg"
  );
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    projectType: "single",
    collaborators: "",
    audioFile: null,
    imageFile: null,
    imagePreview: null,
    audioPreview: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({
    monthlyListeners: 0,
    totalStreams: 0,
    followers: 0,
    albumsCount: 0,
    tracksCount: 0,
  });

  // Fonction pour gérer le redimensionnement
  const handleResize = () => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
  };

  // Écouteur d'événement resize
  useEffect(() => {
    handleResize(); // Initialisation
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fonction pour uploader une image
  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "banner") {
          setBannerImage(e.target.result);
          setShowBannerUpload(false);
        } else if (type === "profile") {
          setProfileImage(e.target.result);
          setShowProfileUpload(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour ouvrir le sélecteur de fichier
  const openFileSelector = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleImageUpload(e, type);
    input.click();
  };

  // Fonction pour gérer les changements du formulaire
  const handleFormChange = (field, value) => {
    setUploadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour gérer l'upload de fichiers
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "audio") {
          setUploadForm((prev) => ({
            ...prev,
            audioFile: file,
            audioPreview: e.target.result,
          }));
        } else if (type === "image") {
          setUploadForm((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: e.target.result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Validation côté client
      if (!uploadForm.title.trim()) {
        alert("Le titre du projet est requis");
        return;
      }

      if (!uploadForm.audioFile) {
        alert("Un fichier audio est requis");
        return;
      }

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append("title", uploadForm.title.trim());
      formData.append("description", uploadForm.description.trim());
      formData.append("projectType", uploadForm.projectType);
      formData.append("collaborators", uploadForm.collaborators.trim());

      if (uploadForm.audioFile) {
        formData.append("audioFile", uploadForm.audioFile);
      }
      if (uploadForm.imageFile) {
        formData.append("imageFile", uploadForm.imageFile);
      }
      // Envoyer à l'API
      const response = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        // Réinitialiser le formulaire
        setUploadForm({
          title: "",
          description: "",
          projectType: "single",
          collaborators: "",
          audioFile: null,
          imageFile: null,
          imagePreview: null,
          audioPreview: null,
        });

        setShowUploadModal(false);
        alert("Projet uploadé avec succès !");
      } else {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        alert(`Erreur: ${errorData.error || "Erreur lors de l'upload"}`);
      }
    } catch (error) {
      console.error("Erreur upload détaillée:", error);
      alert(`Erreur de connexion: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setUploadForm({
      title: "",
      description: "",
      projectType: "single",
      collaborators: "",
      audioFile: null,
      imageFile: null,
      imagePreview: null,
      audioPreview: null,
    });
    setShowUploadModal(false);
  };

  // Fonction pour tester la récupération des projets
  const testGetProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        alert(`Nombre de projets en base: ${data.projects.length}`);
      } else {
        alert("Erreur lors de la récupération des projets");
      }
    } catch (error) {
      console.error("Erreur test projets:", error);
      alert("Erreur de connexion");
    }
  };

  // Données fictives pour les albums
  const albums = [
    {
      id: 1,
      name: "Premier Album",
      image: "/default-album.jpg",
      tracks: 12,
      releaseDate: "2024-01-15",
      streams: 15420,
    },
    {
      id: 2,
      name: "Nouveaux Horizons",
      image: "/default-album.jpg",
      tracks: 8,
      releaseDate: "2024-03-22",
      streams: 8920,
    },
  ];

  // Données fictives pour les titres
  const tracks = [
    {
      id: 1,
      name: "Ma Première Chanson",
      album: "Premier Album",
      duration: "3:45",
      streams: 5420,
      image: "/default-album.jpg",
    },
    {
      id: 2,
      name: "Nouveau Départ",
      album: "Nouveaux Horizons",
      duration: "4:12",
      streams: 3200,
      image: "/default-album.jpg",
    },
  ];

  // Données fictives pour les analytics
  const analytics = {
    weeklyGrowth: 12.5,
    topCountries: [
      { country: "France", percentage: 45 },
      { country: "Canada", percentage: 25 },
      { country: "Belgique", percentage: 15 },
      { country: "Suisse", percentage: 10 },
      { country: "Autres", percentage: 5 },
    ],
    ageGroups: [
      { group: "18-24", percentage: 35 },
      { group: "25-34", percentage: 40 },
      { group: "35-44", percentage: 15 },
      { group: "45+", percentage: 10 },
    ],
  };

  useEffect(() => {
    setStats({
      monthlyListeners: artistData?.monthlyListeners || 1250,
      totalStreams: artistData?.totalStreams || 45600,
      followers: artistData?.followers || 890,
      albumsCount: albums.length,
      tracksCount: tracks.length,
    });
  }, [artistData]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] transition-colors duration-300">
      {/* Banner avec fonctionnalité d'upload */}
      <div className="relative w-full mx-4 mt-6 overflow-hidden shadow-lg rounded-2xl">
        {/* Image de banner */}
        <div className="relative h-48 md:h-64 lg:h-80">
          <Image
            src={bannerImage}
            alt="Banner de l'artiste"
            fill
            className="object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Bouton d'édition du banner */}
          <button
            onClick={() => openFileSelector("banner")}
            className="absolute p-2 text-white transition-all duration-300 rounded-full top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 group"
            title="Changer la photo de banner"
          >
            <Icon
              lib="fa-solid"
              name="fa-camera"
              className="text-lg transition-transform group-hover:scale-110"
            />
          </button>
        </div>

        {/* Contenu du banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
            {/* Profil avec photo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white dark:border-[#18181b] shadow-lg">
                  <Image
                    src={profileImage}
                    alt="Photo de l'artiste"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                  {artistData?.verified && (
                    <div className="absolute p-1 text-xs text-white bg-green-500 rounded-full bottom-1 right-1">
                      <Icon lib="fa-solid" name="fa-check" />
                    </div>
                  )}
                </div>
                {/* Bouton d'édition du profil */}
                <button
                  onClick={() => openFileSelector("profile")}
                  className="absolute -bottom-1 -right-1 bg-[#ff4545] text-white p-2 rounded-full hover:bg-[#ff3333] transition-all duration-300 group shadow-lg"
                  title="Changer la photo de profil"
                >
                  <Icon
                    lib="fa-solid"
                    name="fa-camera"
                    className="text-sm transition-transform group-hover:scale-110"
                  />
                </button>
              </div>

              <div className="text-white">
                <h2 className="mb-1 text-xl font-bold md:text-2xl lg:text-3xl">
                  {artistData?.stageName || "Nom de scène"}
                </h2>
                <p className="text-sm text-white/80 md:text-base">
                  {artistData?.bio || "Biographie de l'artiste"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {artistData?.genres?.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium text-white rounded-full bg-white/20 backdrop-blur-sm md:px-3"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-[#ff4545] text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
              >
                <Icon lib="fa-solid" name="fa-upload" />
                {isMobile ? "Upload" : "Upload projet"}
              </button>
              {/* Bouton de test temporaire */}
              <button
                onClick={testGetProjects}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 bg-blue-500 rounded-full md:px-6 md:py-3 hover:scale-105 md:text-base"
              >
                <Icon lib="fa-solid" name="fa-database" />
                Test DB
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div
        className={`grid ${
          isMobile
            ? "grid-cols-1"
            : isTablet
            ? "grid-cols-2"
            : "grid-cols-2 md:grid-cols-4"
        } gap-4 md:gap-6 max-w-5xl mx-auto mt-6 md:mt-8 px-4`}
      >
        <div className="bg-white dark:bg-[#232323] rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
          <div className="text-2xl md:text-3xl text-[#ff4545] dark:text-white mb-2">
            <Icon lib="fa-solid" name="fa-users" />
          </div>
          <div className="text-xl font-bold text-black md:text-2xl dark:text-white">
            {formatNumber(stats.monthlyListeners)}
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-300 md:text-sm">
            Auditeurs mensuels
          </div>
        </div>
        <div className="bg-white dark:bg-[#232323] rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
          <div className="text-2xl md:text-3xl text-[#ff4545] dark:text-white mb-2">
            <Icon lib="fa-solid" name="fa-play" />
          </div>
          <div className="text-xl font-bold text-black md:text-2xl dark:text-white">
            {formatNumber(stats.totalStreams)}
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-300 md:text-sm">
            Écoutes totales
          </div>
        </div>
        <div className="bg-white dark:bg-[#232323] rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
          <div className="text-2xl md:text-3xl text-[#ff4545] dark:text-white mb-2">
            <Icon lib="fa-solid" name="fa-heart" />
          </div>
          <div className="text-xl font-bold text-black md:text-2xl dark:text-white">
            {formatNumber(stats.followers)}
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-300 md:text-sm">
            Abonnés
          </div>
        </div>
        <div className="bg-white dark:bg-[#232323] rounded-2xl shadow p-4 md:p-6 flex flex-col items-center">
          <div className="text-2xl md:text-3xl text-[#ff4545] dark:text-white mb-2">
            <Icon lib="fa-solid" name="fa-music" />
          </div>
          <div className="text-xl font-bold text-black md:text-2xl dark:text-white">
            {stats.tracksCount}
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-300 md:text-sm">
            Titres publiés
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap justify-center gap-2 px-4 mt-6 mb-4 md:mt-10 md:mb-6">
        <button
          className={`px-3 md:px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 text-sm md:text-base ${
            activeTab === "overview"
              ? "bg-[#ff4545] text-white shadow-lg"
              : "bg-black/10 dark:bg-white/10 text-black dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 hover:scale-105"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <Icon lib="fa-solid" name="fa-chart-line" />
          {isMobile ? "Vue" : "Vue d'ensemble"}
        </button>
        <button
          className={`px-3 md:px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 text-sm md:text-base ${
            activeTab === "albums"
              ? "bg-[#ff4545] text-white shadow-lg"
              : "bg-black/10 dark:bg-white/10 text-black dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 hover:scale-105"
          }`}
          onClick={() => setActiveTab("albums")}
        >
          <Icon lib="fa-solid" name="fa-compact-disc" />
          Albums
        </button>
        <button
          className={`px-3 md:px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 text-sm md:text-base ${
            activeTab === "tracks"
              ? "bg-[#ff4545] text-white shadow-lg"
              : "bg-black/10 dark:bg-white/10 text-black dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 hover:scale-105"
          }`}
          onClick={() => setActiveTab("tracks")}
        >
          <Icon lib="fa-solid" name="fa-music" />
          Titres
        </button>
        <button
          className={`px-3 md:px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 text-sm md:text-base ${
            activeTab === "analytics"
              ? "bg-[#ff4545] text-white shadow-lg"
              : "bg-black/10 dark:bg-white/10 text-black dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 hover:scale-105"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          <Icon lib="fa-solid" name="fa-chart-pie" />
          Analytics
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-5xl p-4 mx-4 mx-auto border shadow-xl bg-black/5 dark:bg-white/10 backdrop-blur-xl border-black/10 dark:border-white/20 rounded-2xl md:p-6">
        {activeTab === "overview" && (
          <div>
            <h3 className="mb-4 text-xl font-bold text-black md:text-2xl dark:text-white md:mb-6">
              Vue d'ensemble
            </h3>
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              } gap-4 md:gap-6`}
            >
              <div className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex flex-col gap-2">
                <div className="text-base md:text-lg font-semibold text-[#ff4545] dark:text-white mb-2">
                  <Icon lib="fa-solid" name="fa-compact-disc" /> Albums publiés
                </div>
                <ul className="space-y-2">
                  {albums.map((album) => (
                    <li
                      key={album.id}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <Image
                        src={album.image}
                        alt={album.name}
                        width={40}
                        height={40}
                        className="object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-black truncate dark:text-white md:text-base">
                          {album.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          {album.tracks} titres • Sorti le {album.releaseDate}
                        </div>
                        <div className="text-xs text-[#ff4545] dark:text-white">
                          {formatNumber(album.streams)} écoutes
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex flex-col gap-2">
                <div className="text-base md:text-lg font-semibold text-[#ff4545] dark:text-white mb-2">
                  <Icon lib="fa-solid" name="fa-music" /> Titres publiés
                </div>
                <ul className="space-y-2">
                  {tracks.map((track) => (
                    <li
                      key={track.id}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <Image
                        src={track.image}
                        alt={track.name}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-black truncate dark:text-white md:text-base">
                          {track.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          {track.album} • {track.duration}
                        </div>
                        <div className="text-xs text-[#ff4545] dark:text-white">
                          {formatNumber(track.streams)} écoutes
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === "albums" && (
          <div>
            <h3 className="mb-4 text-xl font-bold text-black md:text-2xl dark:text-white md:mb-6">
              Albums
            </h3>
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              } gap-4 md:gap-6`}
            >
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex gap-3 md:gap-4 items-center"
                >
                  <Image
                    src={album.image}
                    alt={album.name}
                    width={48}
                    height={48}
                    className="flex-shrink-0 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-black truncate dark:text-white md:text-lg">
                      {album.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {album.tracks} titres • Sorti le {album.releaseDate}
                    </div>
                    <div className="text-xs text-[#ff4545] dark:text-white">
                      {formatNumber(album.streams)} écoutes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "tracks" && (
          <div>
            <h3 className="mb-4 text-xl font-bold text-black md:text-2xl dark:text-white md:mb-6">
              Titres
            </h3>
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              } gap-4 md:gap-6`}
            >
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex gap-3 md:gap-4 items-center"
                >
                  <Image
                    src={track.image}
                    alt={track.name}
                    width={40}
                    height={40}
                    className="flex-shrink-0 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-black truncate dark:text-white md:text-lg">
                      {track.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {track.album} • {track.duration}
                    </div>
                    <div className="text-xs text-[#ff4545] dark:text-white">
                      {formatNumber(track.streams)} écoutes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "analytics" && (
          <div>
            <h3 className="mb-4 text-xl font-bold text-black md:text-2xl dark:text-white md:mb-6">
              Analytics
            </h3>
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              } gap-4 md:gap-6`}
            >
              <div className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex flex-col gap-4">
                <div className="text-base md:text-lg font-semibold text-[#ff4545] dark:text-white mb-2">
                  <Icon lib="fa-solid" name="fa-arrow-trend-up" /> Croissance
                  hebdo
                </div>
                <div className="text-2xl font-bold text-black md:text-3xl dark:text-white">
                  +{analytics.weeklyGrowth}%
                </div>
              </div>
              <div className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex flex-col gap-4">
                <div className="text-base md:text-lg font-semibold text-[#ff4545] dark:text-white mb-2">
                  <Icon lib="fa-solid" name="fa-earth-europe" /> Top pays
                </div>
                <ul className="space-y-2">
                  {analytics.topCountries.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-black dark:text-white">
                        {item.country}
                      </span>
                      <span className="text-[#ff4545] dark:text-white font-bold text-sm">
                        {item.percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-[#232323] rounded-xl p-4 md:p-6 shadow flex flex-col gap-4">
                <div className="text-base md:text-lg font-semibold text-[#ff4545] dark:text-white mb-2">
                  <Icon lib="fa-solid" name="fa-user-group" /> Tranches d'âge
                </div>
                <ul className="space-y-2">
                  {analytics.ageGroups.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-black dark:text-white">
                        {item.group}
                      </span>
                      <span className="text-[#ff4545] dark:text-white font-bold text-sm">
                        {item.percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales d'upload (optionnel) */}
      {showBannerUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#232323] rounded-2xl p-6 max-w-md w-full">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Changer la photo de banner
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Sélectionnez une nouvelle image pour votre banner
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => openFileSelector("banner")}
                className="flex-1 bg-[#ff4545] text-white px-4 py-2 rounded-lg hover:bg-[#ff3333] transition-colors"
              >
                Choisir une image
              </button>
              <button
                onClick={() => setShowBannerUpload(false)}
                className="flex-1 px-4 py-2 text-black transition-colors bg-gray-300 rounded-lg dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#232323] rounded-2xl p-6 max-w-md w-full">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Changer la photo de profil
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Sélectionnez une nouvelle image pour votre profil
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => openFileSelector("profile")}
                className="flex-1 bg-[#ff4545] text-white px-4 py-2 rounded-lg hover:bg-[#ff3333] transition-colors"
              >
                Choisir une image
              </button>
              <button
                onClick={() => setShowProfileUpload(false)}
                className="flex-1 px-4 py-2 text-black transition-colors bg-gray-300 rounded-lg dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload Projet */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#232323] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Upload Nouveau Projet
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Icon lib="fa-solid" name="fa-times" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-6">
              {/* Titre du projet */}
              <div>
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2d2d2d] text-black dark:text-white focus:ring-2 focus:ring-[#ff4545] focus:border-transparent"
                  placeholder="Entrez le titre de votre projet"
                />
              </div>

              {/* Type de projet */}
              <div>
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  Type de projet *
                </label>
                <select
                  required
                  value={uploadForm.projectType}
                  onChange={(e) =>
                    handleFormChange("projectType", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2d2d2d] text-black dark:text-white focus:ring-2 focus:ring-[#ff4545] focus:border-transparent"
                >
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                  <option value="album">Album</option>
                  <option value="mixtape">Mixtape</option>
                </select>
              </div>

              {/* Collaborateurs */}
              <div>
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  Artistes en collaboration
                </label>
                <input
                  type="text"
                  value={uploadForm.collaborators}
                  onChange={(e) =>
                    handleFormChange("collaborators", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2d2d2d] text-black dark:text-white focus:ring-2 focus:ring-[#ff4545] focus:border-transparent"
                  placeholder="Séparez les noms par des virgules"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2d2d2d] text-black dark:text-white focus:ring-2 focus:ring-[#ff4545] focus:border-transparent resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>

              {/* Upload Audio */}
              <div>
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  Fichier Audio *
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#ff4545] transition-colors">
                  <input
                    type="file"
                    accept="audio/*"
                    required
                    onChange={(e) => handleFileUpload(e, "audio")}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer">
                    <Icon
                      lib="fa-solid"
                      name="fa-music"
                      className="mb-2 text-4xl text-gray-400"
                    />
                    <p className="text-gray-600 dark:text-gray-400">
                      {uploadForm.audioFile
                        ? uploadForm.audioFile.name
                        : "Cliquez pour sélectionner un fichier audio"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                      MP3, WAV, FLAC (max 50MB)
                    </p>
                  </label>
                </div>
                {uploadForm.audioPreview && (
                  <div className="p-3 mt-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✓ Fichier audio sélectionné
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Image */}
              <div>
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  Image du projet
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-[#ff4545] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Icon
                      lib="fa-solid"
                      name="fa-image"
                      className="mb-2 text-4xl text-gray-400"
                    />
                    <p className="text-gray-600 dark:text-gray-400">
                      {uploadForm.imageFile
                        ? uploadForm.imageFile.name
                        : "Cliquez pour sélectionner une image"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                      JPG, PNG, GIF (max 5MB)
                    </p>
                  </label>
                </div>
                {uploadForm.imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={uploadForm.imagePreview}
                      alt="Aperçu"
                      className="object-cover w-20 h-20 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-[#ff4545] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#ff3333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Icon
                        lib="fa-solid"
                        name="fa-spinner"
                        className="animate-spin"
                      />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Icon lib="fa-solid" name="fa-upload" />
                      Upload le projet
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 font-semibold text-black transition-colors bg-gray-300 rounded-lg dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
