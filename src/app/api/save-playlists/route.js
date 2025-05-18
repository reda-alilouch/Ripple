import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { playlists } = await req.json();

    const client = await clientPromise;
    const db = client.db("spotify");
    const collection = db.collection("playlists");

    const operations = playlists.map((playlist) => ({
      updateOne: {
        filter: { id: playlist.id },
        update: { $set: playlist },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await collection.bulkWrite(operations);
    }

    return new Response(JSON.stringify({ success: true, inserted: operations.length }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
