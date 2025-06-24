import { connectMongoDB } from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function GET() {
  await connectMongoDB();
  const playlists = await Playlist.find({});
  return Response.json(playlists);
}
