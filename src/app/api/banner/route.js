import Banner from "@/models/Banner";
import connectMongoDB from "@/lib/mongodb";

export async function GET() {
  await connectMongoDB();
  const banners = await Banner.find({});
  return Response.json(banners);
} 