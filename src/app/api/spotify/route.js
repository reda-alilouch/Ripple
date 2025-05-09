export async function POST(req) {
    // Exemple de logique ici
    return new Response(JSON.stringify({ message: "Spotify route ok" }), {
      status: 200,
    });
  }
  