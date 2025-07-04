import Icon from "@/components/Icon";
import axios from "axios";

const AddTitre = ({ trackId, playlistId }) => {
  const handleAddToPlaylist = async (e) => {
    e.preventDefault();
    if (!playlistId || !trackId) {
      alert("Playlist ou titre manquant");
      return;
    }
    try {
      const res = await axios.post("/api/spotify/playlist/add", {
        playlistId,
        trackId,
      });
      if (res.data.success) {
        alert("Titre ajouté à la playlist !");
      } else {
        alert(
          "Erreur : " + (res.data.error || "Impossible d'ajouter le titre")
        );
      }
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <a href="#" onClick={handleAddToPlaylist} title="Ajouter à la playlist">
      <Icon lib="fa-solid" name="fa-plus" className="!block " />
    </a>
  );
};

export default AddTitre;
