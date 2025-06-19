import React from 'react';
import Playlist from '../Card/Playlist';

const PlaylistDemo = () => {
  // Données statiques pour démonstration
  const demoPlaylists = [
    {
      id: 1,
      title: "Chill Vibes",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop",
      trackCount: 24,
      duration: 78
    },
    {
      id: 2,
      title: "Workout Mix",
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop",
      trackCount: 18,
      duration: 65
    },
    {
      id: 3,
      title: "Focus Flow",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      trackCount: 15,
      duration: 120
    },
    {
      id: 4,
      title: "Summer Hits",
      imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
      trackCount: 30,
      duration: 105
    },
    {
      id: 5,
      title: "Rock Classics",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27d5f0?w=300&h=300&fit=crop",
      trackCount: 25,
      duration: 150
    },
    {
      id: 6,
      title: "Hip Hop Essentials",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      trackCount: 20,
      duration: 90
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Découvrez nos playlists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {demoPlaylists.map(playlist => (
          <Playlist
            key={playlist.id}
            title={playlist.title}
            imageUrl={playlist.imageUrl}
            trackCount={playlist.trackCount}
            duration={playlist.duration}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistDemo;
