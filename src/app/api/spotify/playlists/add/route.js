import { connectMongoDB } from "@/lib/mongodb";
import Playlist from "@/models/Playlist";

export async function POST(req) {
  await connectMongoDB();
  const { playlistId, trackId } = await req.json();

  // Ajoute le titre à la playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist)
    return Response.json({ error: "Playlist not found" }, { status: 404 });

  if (!playlist.tracks.includes(trackId)) {
    playlist.tracks.push(trackId);
    await playlist.save();
  }

  return Response.json({ success: true, playlist });
}
