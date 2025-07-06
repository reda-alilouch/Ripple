"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import styles from "./ArtistDashboard.module.css";

const ArtistDashboard = ({ artistData }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    monthlyListeners: 0,
    totalStreams: 0,
    followers: 0,
    albumsCount: 0,
    tracksCount: 0,
  });

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
    // Simuler le chargement des statistiques
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
    <div className={styles.dashboard}>
      {/* En-tête du tableau de bord */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.artistInfo}>
            <div className={styles.artistImage}>
              <Image
                src={artistData?.image || "/default-artist.svg"}
                alt="Photo de l'artiste"
                width={80}
                height={80}
                className={styles.image}
              />
              {artistData?.verified && (
                <div className={styles.verifiedBadge}>
                  <Icon lib="fa-solid" name="fa-check" />
                </div>
              )}
            </div>
            <div className={styles.artistDetails}>
              <h1 className={styles.artistName}>
                {artistData?.stageName || "Nom de scène"}
              </h1>
              <p className={styles.artistBio}>
                {artistData?.bio || "Biographie de l'artiste"}
              </p>
              <div className={styles.genres}>
                {artistData?.genres?.map((genre, index) => (
                  <span key={index} className={styles.genreTag}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actionButton}>
              <Icon lib="fa-solid" name="fa-plus" />
              Nouveau titre
            </button>
            <button className={styles.actionButton}>
              <Icon lib="fa-solid" name="fa-edit" />
              Modifier le profil
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon lib="fa-solid" name="fa-users" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              {formatNumber(stats.monthlyListeners)}
            </h3>
            <p className={styles.statLabel}>Auditeurs mensuels</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon lib="fa-solid" name="fa-play" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              {formatNumber(stats.totalStreams)}
            </h3>
            <p className={styles.statLabel}>Écoutes totales</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon lib="fa-solid" name="fa-heart" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              {formatNumber(stats.followers)}
            </h3>
            <p className={styles.statLabel}>Abonnés</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Icon lib="fa-solid" name="fa-music" />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.tracksCount}</h3>
            <p className={styles.statLabel}>Titres publiés</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <Icon lib="fa-solid" name="fa-chart-line" />
          Vue d'ensemble
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "tracks" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("tracks")}
        >
          <Icon lib="fa-solid" name="fa-music" />
          Mes titres
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "albums" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("albums")}
        >
          <Icon lib="fa-solid" name="fa-compact-disc" />
          Mes albums
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "analytics" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          <Icon lib="fa-solid" name="fa-chart-bar" />
          Analytics
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <div className={styles.overview}>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <h3>Croissance hebdomadaire</h3>
                <div className={styles.growthIndicator}>
                  <Icon lib="fa-solid" name="fa-arrow-up" />
                  <span className={styles.growthValue}>
                    +{analytics.weeklyGrowth}%
                  </span>
                </div>
                <p>Par rapport à la semaine dernière</p>
              </div>
              <div className={styles.overviewCard}>
                <h3>Top pays</h3>
                <div className={styles.countryList}>
                  {analytics.topCountries.map((country, index) => (
                    <div key={index} className={styles.countryItem}>
                      <span>{country.country}</span>
                      <span>{country.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.overviewCard}>
                <h3>Répartition par âge</h3>
                <div className={styles.ageGroups}>
                  {analytics.ageGroups.map((group, index) => (
                    <div key={index} className={styles.ageGroup}>
                      <span>{group.group}</span>
                      <div className={styles.ageBar}>
                        <div
                          className={styles.ageBarFill}
                          style={{ width: `${group.percentage}%` }}
                        ></div>
                      </div>
                      <span>{group.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tracks" && (
          <div className={styles.tracksSection}>
            <div className={styles.sectionHeader}>
              <h2>Mes titres</h2>
              <button className={styles.addButton}>
                <Icon lib="fa-solid" name="fa-plus" />
                Ajouter un titre
              </button>
            </div>
            <div className={styles.tracksList}>
              {tracks.map((track) => (
                <div key={track.id} className={styles.trackItem}>
                  <div className={styles.trackImage}>
                    <Image
                      src={track.image}
                      alt={track.name}
                      width={60}
                      height={60}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.trackInfo}>
                    <h4>{track.name}</h4>
                    <p>{track.album}</p>
                  </div>
                  <div className={styles.trackStats}>
                    <span>{track.duration}</span>
                    <span>{formatNumber(track.streams)} écoutes</span>
                  </div>
                  <div className={styles.trackActions}>
                    <button className={styles.actionBtn}>
                      <Icon lib="fa-solid" name="fa-edit" />
                    </button>
                    <button className={styles.actionBtn}>
                      <Icon lib="fa-solid" name="fa-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "albums" && (
          <div className={styles.albumsSection}>
            <div className={styles.sectionHeader}>
              <h2>Mes albums</h2>
              <button className={styles.addButton}>
                <Icon lib="fa-solid" name="fa-plus" />
                Créer un album
              </button>
            </div>
            <div className={styles.albumsGrid}>
              {albums.map((album) => (
                <div key={album.id} className={styles.albumCard}>
                  <div className={styles.albumImage}>
                    <Image
                      src={album.image}
                      alt={album.name}
                      width={200}
                      height={200}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.albumInfo}>
                    <h4>{album.name}</h4>
                    <p>
                      {album.tracks} titres • {album.releaseDate}
                    </p>
                    <p>{formatNumber(album.streams)} écoutes</p>
                  </div>
                  <div className={styles.albumActions}>
                    <button className={styles.actionBtn}>
                      <Icon lib="fa-solid" name="fa-edit" />
                    </button>
                    <button className={styles.actionBtn}>
                      <Icon lib="fa-solid" name="fa-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className={styles.analyticsSection}>
            <h2>Analytics détaillées</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h3>Évolution des écoutes</h3>
                <div className={styles.chartPlaceholder}>
                  <Icon lib="fa-solid" name="fa-chart-line" />
                  <p>Graphique d'évolution</p>
                </div>
              </div>
              <div className={styles.analyticsCard}>
                <h3>Répartition géographique</h3>
                <div className={styles.chartPlaceholder}>
                  <Icon lib="fa-solid" name="fa-globe" />
                  <p>Carte des écoutes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboard;
