// src/app/api/test-connection/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Assure-toi que c'est la bonne importation de ton client MongoDB

export async function GET() {
  try {
    const client = await clientPromise; // Cela essaiera de se connecter à MongoDB
    const db = client.db(); // Obtenir une référence à la base de données
    const collection = db.collection('tracks'); // Par exemple, accéder à la collection "tracks"
    
    // Essayer d'effectuer une requête simple (par exemple, récupérer 1 document)
    const track = await collection.findOne({}); 

    if (track) {
      return NextResponse.json({ success: true, message: 'Connexion réussie à MongoDB', track });
    } else {
      return NextResponse.json({ success: false, message: 'Aucun document trouvé dans la collection tracks' });
    }
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
