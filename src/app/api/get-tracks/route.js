import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("spotify");
    const tracks = await db.collection("tracks").find({}).limit(20).toArray();

    return new Response(JSON.stringify({ success: true, tracks }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
