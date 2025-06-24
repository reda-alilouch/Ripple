import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import connectMongoDB from "../lib/mongodb.js";
import Banner from "../models/Banner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env.local") });

async function addBanners() {
  await connectMongoDB();
  const banners = [
    {
      title: "Découvrez de nouvelles musiques",
      description: "Explorez notre vaste collection de titres",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Créez vos playlists",
      description: "Organisez votre musique comme vous le souhaitez",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Écoutez partout",
      description: "Profitez de votre musique où que vous soyez",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
  ];
  await Banner.deleteMany({}); // Nettoie la collection avant d'insérer
  await Banner.insertMany(banners);
  console.log("Bannières insérées !");
  process.exit(0);
}

addBanners();
