import { connectMongoDB } from "@/lib/mongodb";
import Artiste from "@/models/Artiste";

export async function GET() {
  await connectMongoDB();
  const artistes = await Artiste.find({});
  return Response.json(artistes);
}
