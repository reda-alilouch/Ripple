import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Project from "@/models/Project"; // Nous devrons créer ce modèle

export async function POST(request) {
  try {
    // Connecter à la base de données
    await connectMongoDB();

    const formData = await request.formData();

    // Extraire les données du formulaire
    const title = formData.get("title");
    const description = formData.get("description");
    const projectType = formData.get("projectType");
    const collaborators = formData.get("collaborators");
    const audioFile = formData.get("audioFile");
    const imageFile = formData.get("imageFile");

    console.log("Données reçues:", {
      title,
      description,
      projectType,
      collaborators,
      audioFile: audioFile ? audioFile.name : "Aucun fichier audio",
      imageFile: imageFile ? imageFile.name : "Aucune image",
    });

    // Validation des données requises
    if (!title || !projectType || !audioFile) {
      return NextResponse.json(
        {
          error: "Titre, type de projet et fichier audio sont requis",
          received: { title, projectType, hasAudio: !!audioFile },
        },
        { status: 400 }
      );
    }

    // Validation du type de fichier audio
    const allowedAudioTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/flac",
      "audio/mp3",
    ];
    if (!allowedAudioTypes.includes(audioFile.type)) {
      return NextResponse.json(
        {
          error:
            "Type de fichier audio non supporté. Utilisez MP3, WAV ou FLAC",
        },
        { status: 400 }
      );
    }

    // Validation de la taille du fichier audio (50MB max)
    const maxAudioSize = 50 * 1024 * 1024; // 50MB
    if (audioFile.size > maxAudioSize) {
      return NextResponse.json(
        { error: "Le fichier audio est trop volumineux. Maximum 50MB" },
        { status: 400 }
      );
    }

    // Validation de l'image si fournie
    if (imageFile) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedImageTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: "Type d'image non supporté. Utilisez JPG, PNG ou GIF" },
          { status: 400 }
        );
      }

      const maxImageSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxImageSize) {
        return NextResponse.json(
          { error: "L'image est trop volumineuse. Maximum 5MB" },
          { status: 400 }
        );
      }
    }

    // Traitement des fichiers (ici vous devrez implémenter l'upload vers votre service de stockage)
    let audioUrl = null;
    let imageUrl = null;

    if (audioFile) {
      // Simuler l'upload audio
      audioUrl = `/uploads/audio/${Date.now()}_${audioFile.name}`;
      console.log("URL audio simulée:", audioUrl);
    }

    if (imageFile) {
      // Simuler l'upload image
      imageUrl = `/uploads/images/${Date.now()}_${imageFile.name}`;
      console.log("URL image simulée:", imageUrl);
    }

    // Créer et sauvegarder le projet dans la base de données
    const project = new Project({
      title,
      description,
      projectType,
      collaborators: collaborators
        ? collaborators.split(",").map((c) => c.trim())
        : [],
      audioUrl,
      imageUrl,
      artistId: "user_id_here", // Remplacer par l'ID de l'artiste connecté
      createdAt: new Date(),
      status: "pending",
    });

    console.log("Sauvegarde du projet en base de données...");
    const savedProject = await project.save();
    console.log("Projet sauvegardé avec succès:", savedProject._id);

    return NextResponse.json({
      success: true,
      message: "Projet uploadé avec succès",
      project: {
        id: savedProject._id,
        title: savedProject.title,
        projectType: savedProject.projectType,
        status: savedProject.status,
        audioUrl: savedProject.audioUrl,
        imageUrl: savedProject.imageUrl,
      },
    });
  } catch (error) {
    console.error("Erreur détaillée upload projet:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'upload du projet",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
