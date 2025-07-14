// pages/callback.js ou app/callback/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SpotifyCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        if (error) {
          setError(`Erreur Spotify: ${error}`);
          setStatus('error');
          return;
        }
        
        if (!code || !state) {
          setError('Paramètres manquants dans la réponse Spotify');
          setStatus('error');
          return;
        }
        
        // Vérifier le state
        const savedState = localStorage.getItem('spotify_auth_state');
        if (state !== savedState) {
          setError('State invalide - possible attaque CSRF');
          setStatus('error');
          return;
        }
        
        // Nettoyer le state
        localStorage.removeItem('spotify_auth_state');
        
        // Échanger le code contre un token
        const response = await fetch('/api/auth/spotify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Erreur lors de l\'authentification');
          setStatus('error');
          return;
        }
        
        // Sauvegarder les tokens (vous pouvez les stocker dans votre base de données)
        localStorage.setItem('spotify_access_token', data.tokens.access_token);
        localStorage.setItem('spotify_refresh_token', data.tokens.refresh_token);
        localStorage.setItem('spotify_expires_at', Date.now() + (data.tokens.expires_in * 1000));
        
        // Connecter l'utilisateur avec NextAuth (optionnel)
        // await signIn('spotify', { callbackUrl: '/profil' });
        
        setStatus('success');
        
        // Rediriger vers le profil après 2 secondes
        setTimeout(() => {
          router.push('/profil');
        }, 2000);
        
      } catch (err) {
        console.error('Callback error:', err);
        setError('Erreur lors du traitement de la réponse Spotify');
        setStatus('error');
      }
    };
    
    handleCallback();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DB954] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Connexion avec Spotify...
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Veuillez patienter pendant que nous finalisons votre connexion.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Erreur de connexion
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#FF4545] text-white rounded-lg hover:bg-[#E03E3E] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-green-600 dark:text-green-400 text-xl"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Connexion réussie !
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes maintenant connecté avec Spotify. Redirection en cours...
        </p>
        <div className="flex items-center justify-center gap-2 text-[#1DB954]">
          <i className="fab fa-spotify text-xl"></i>
          <span className="font-medium">Spotify connecté</span>
        </div>
      </div>
    </div>
  );
}