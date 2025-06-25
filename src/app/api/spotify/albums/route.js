import { connectMongoDB } from "@/lib/mongodb";
import Album from "@/models/Album";

export async function GET() {
  await connectMongoDB();
  const albums = await Album.find({});
  return Response.json(albums);
}
