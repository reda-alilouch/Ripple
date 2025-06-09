// app/profil/page.js
import { getServerSession } from "@auth/core";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Profil() {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div>
      <h1>Profil</h1>
      <p>
        Bienvenue, {session.user.name} ({session.user.email})
      </p>
    </div>
  );
}
