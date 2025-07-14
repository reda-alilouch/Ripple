import Titre from "@/components/Card/Titre/Titre";

export default function TestProjectPage() {
  // Exemple de données projet (props minimales pour Titre)
  const project = {
    id: "test-id-1",
    name: "reda",
    image: "/uploads/images/Capture d'écran 2023-11-26 193010.png", // image par défaut qui existe bien
    preview_url: "/uploads/audio/7ARI - Moonlight (128).mp3",
    artists: [{ name: "Artiste Test", id: "artist-id-1" }],
    duration_ms: 180000,
  };

  return (
    <div style={{ padding: 32 }}>
      <Titre track={project} />
    </div>
  );
}
