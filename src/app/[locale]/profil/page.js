import { getServerSession } from "next-auth/next";
export default async function Profil() {
  // Récupérer la session côté serveur
  const session = await getServerSession();

  let userData = null;
  if (session?.provider === "google") {
    // Configurer les credentials pour Google People API
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const people = google.people({ version: "v1", auth });
    const { data } = await people.people.get({
      resourceName: "people/me",
      personFields: "names,emailAddresses",
    });
    userData = data;
  } else if (session?.provider === "custom") {
    // Récupérer les données utilisateur depuis MongoDB
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("your-db");
    userData = await db.collection("users").findOne({ email: session.email });
    await client.close();
  }

  return (
    <div>
      <h1>Profil</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}
