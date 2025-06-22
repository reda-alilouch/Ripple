// app/api/translations/[[...lng]]/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Translation from '@/models/Translation';

export async function GET(request, { params }) {
  const { lng } = params;
  const { searchParams } = new URL(request.url);
  const ns = searchParams.get('ns') || 'common';

  try {
    await connectMongoDB();
    
    // Récupérer toutes les traductions pour la langue et le namespace demandés
    const translations = await Translation.find({ namespace: ns });
    
    // Transformer les données au format attendu par i18next
    const result = {};
    translations.forEach(item => {
      result[item.key] = item.values[lng] || item.values['fr']; // Fallback au français
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to load translations' },
      { status: 500 }
    );
  }
}