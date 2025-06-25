import { connectMongoDB } from "@/lib/mongodb";
import Titre from "@/models/Titre";

export async function GET() {
  await connectMongoDB();
  const titres = await Titre.find({});
  return Response.json(titres);
}
