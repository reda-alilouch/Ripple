// pages/api/auth/spotify.js or app/api/auth/spotify/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code, state } = await request.json();
    
    // Vérifier le state pour la sécurité
    if (!state) {
      return NextResponse.json({ error: 'State parameter missing' }, { status: 400 });
    }
    
    // Échanger le code contre un token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URIc
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    // Récupérer les informations utilisateur
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 400 });
    }

    // Ici vous pouvez créer/mettre à jour l'utilisateur dans votre base de données
    // et créer une session avec NextAuth
    
    return NextResponse.json({
      success: true,
      user: userData,
      tokens: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in
      }
    });
    
  } catch (error) {
    console.error('Spotify auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// pages/api/spotify/refresh.js - Pour rafraîchir le token
export async function POST(request) {
  try {
    const { refresh_token } = await request.json();
    
    if (!refresh_token) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      })
    });

    const tokenData = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token || refresh_token
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}