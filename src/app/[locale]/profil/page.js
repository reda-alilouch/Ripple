import { getServerSession } from "next-auth/next";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/users";

export default async function Profil() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Profil</h1>
        <p>Vous devez être connecté pour voir cette page.</p>
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profil</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
