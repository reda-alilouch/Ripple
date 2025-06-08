"use client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authConfig } from "../api/auth/config/auth.config";

export default async function ProfilPage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenue {session.user.name}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        </div>

        {/* Ajoutez ici le contenu de votre profil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section des playlists */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Mes Playlists</h3>
            {/* Contenu des playlists */}
          </div>

          {/* Section des artistes favoris */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Artistes Favoris</h3>
            {/* Contenu des artistes */}
          </div>

          {/* Section des morceaux récents */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Morceaux Récents</h3>
            {/* Contenu des morceaux */}
          </div>
        </div>
      </div>
    </div>
  );
}
