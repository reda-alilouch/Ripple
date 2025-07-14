import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectMongoDB();
    
    const projects = await Project.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('Erreur récupération projets:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    );
  }
} 