import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { artists } = await req.json();

    const client = await clientPromise;
    const db = client.db("spotify");
    const collection = db.collection("artists");

    const operations = artists.map((artist) => ({
      updateOne: {
        filter: { id: artist.id },
        update: { $set: artist },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await collection.bulkWrite(operations);
    }

    return new Response(
      JSON.stringify({ success: true, inserted: operations.length }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
