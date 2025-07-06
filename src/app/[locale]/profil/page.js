import { getServerSession } from "next-auth/next";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";
import ProfilClient from "./ProfilClient";

export default async function Profil() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Profil</h1>
          <p className="text-gray-200">
            Vous devez être connecté pour voir cette page.
          </p>
        </div>
      </div>
    );
  }

  let userData = {};

  try {
    if (session.user?.email) {
      await connectMongoDB();
      const userFromDb = await User.findOne({ email: session.user.email })
        .lean()
        .exec();

      if (userFromDb) {
        // Exclure le mot de passe pour la sécurité
        const { password, ...userSafeData } = userFromDb;
        userData = { ...session.user, ...userSafeData };
      } else {
        // Si l'utilisateur (ex: Google) n'est pas dans notre BDD, on utilise les infos de la session
        userData = session.user;
      }
    } else {
      userData = session.user;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données utilisateur:",
      error
    );
    userData = {
      ...session.user,
      error: "Impossible de charger les données complètes du profil.",
    };
  }

  // Conversion en objet simple pour éviter les problèmes Mongoose/Buffer
  const userDataSimple = JSON.parse(JSON.stringify(userData));

  return <ProfilClient userData={userDataSimple} />;
}
