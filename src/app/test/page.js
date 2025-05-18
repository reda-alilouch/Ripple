"use client";
import { useState } from "react";

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const saveTracks = async () => {
    setLoading(true);
    const res = await fetch("/api/save-tracks?q=daft punk");
    const json = await res.json();

    if (json.success) {
      const post = await fetch("/api/save-tracks", {
        method: "POST",
        body: JSON.stringify({ tracks: json.data.tracks }),
        headers: { "Content-Type": "application/json" },
      });

      const postRes = await post.json();
      setResult(postRes);
    } else {
      setResult({ error: "Erreur récupération Spotify" });
    }

    setLoading(false);
  };

  return (
    <div className="p-24">
      <h1>Test Save Tracks</h1>
      <button onClick={saveTracks} disabled={loading}>
        {loading ? "En cours..." : "Importer & Enregistrer"}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
