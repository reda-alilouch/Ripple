import { NextResponse } from "next/server";
import { Track, Artist, Playlist, Album } from "@/models/spotify";
import { getAccessToken } from "@/lib/spotify";
import connectMongoDB from "@/lib/mongodb";

async function fetchSpotifyData(endpoint, accessToken) {
  console.log(`Fetching data from ${endpoint}...`);
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error(`Error response from Spotify:`, await response.text());
    throw new Error(`Erreur Spotify API: ${response.statusText}`);
  }

  return response.json();
}

async function syncAlbums(accessToken) {
  const data = await fetchSpotifyData("/browse/new-releases", accessToken);
  const albums = [];

  for (const album of data.albums.items) {
    const fullAlbum = await fetchSpotifyData(
      `/albums/${album.id}`,
      accessToken
    );
    albums.push({
      spotifyId: fullAlbum.id,
      name: fullAlbum.name,
      artists: fullAlbum.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
      images: fullAlbum.images,
      release_date: fullAlbum.release_date,
      total_tracks: fullAlbum.total_tracks,
      type: fullAlbum.album_type,
      genres: fullAlbum.genres,
      popularity: fullAlbum.popularity,
      external_urls: fullAlbum.external_urls,
    });
  }

  await Album.bulkWrite(
    albums.map((album) => ({
      updateOne: {
        filter: { spotifyId: album.spotifyId },
        update: { $set: album },
        upsert: true,
      },
    }))
  );

  return albums.length;
}

async function syncTracks(accessToken) {
  const data = await fetchSpotifyData("/browse/new-releases", accessToken);
  const tracks = [];

  for (const album of data.albums.items) {
    const albumTracks = await fetchSpotifyData(
      `/albums/${album.id}/tracks`,
      accessToken
    );
    for (const track of albumTracks.items) {
      const fullTrack = await fetchSpotifyData(
        `/tracks/${track.id}`,
        accessToken
      );
      tracks.push({
        spotifyId: fullTrack.id,
        name: fullTrack.name,
        artists: fullTrack.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        album: {
          id: album.id,
          name: album.name,
          images: album.images,
        },
        duration_ms: fullTrack.duration_ms,
        popularity: fullTrack.popularity,
        preview_url: fullTrack.preview_url,
        external_urls: fullTrack.external_urls,
      });
    }
  }

  await Track.bulkWrite(
    tracks.map((track) => ({
      updateOne: {
        filter: { spotifyId: track.spotifyId },
        update: { $set: track },
        upsert: true,
      },
    }))
  );

  return tracks.length;
}

async function syncArtists(accessToken) {
  const data = await fetchSpotifyData(
    "/browse/featured-playlists",
    accessToken
  );
  const artistIds = new Set();
  const artists = [];

  for (const playlist of data.playlists.items) {
    const playlistTracks = await fetchSpotifyData(
      `/playlists/${playlist.id}/tracks`,
      accessToken
    );
    for (const item of playlistTracks.items) {
      if (item.track) {
        for (const artist of item.track.artists) {
          if (!artistIds.has(artist.id)) {
            artistIds.add(artist.id);
            const fullArtist = await fetchSpotifyData(
              `/artists/${artist.id}`,
              accessToken
            );
            artists.push({
              spotifyId: fullArtist.id,
              name: fullArtist.name,
              images: fullArtist.images,
              genres: fullArtist.genres,
              popularity: fullArtist.popularity,
              external_urls: fullArtist.external_urls,
            });
          }
        }
      }
    }
  }

  await Artist.bulkWrite(
    artists.map((artist) => ({
      updateOne: {
        filter: { spotifyId: artist.spotifyId },
        update: { $set: artist },
        upsert: true,
      },
    }))
  );

  return artists.length;
}

export async function GET() {
  try {
    console.log("Starting MongoDB connection...");
    await connectMongoDB();
    console.log("MongoDB connected successfully");

    console.log("Getting Spotify access token...");
    const accessToken = await getAccessToken();
    console.log("Got Spotify access token");

    console.log("Starting data synchronization...");
    const [tracksCount, artistsCount, albumsCount] = await Promise.all([
      syncTracks(accessToken),
      syncArtists(accessToken),
      syncAlbums(accessToken),
    ]);
    console.log("Data synchronization completed");

    return NextResponse.json({
      success: true,
      message: `Synchronisation réussie: ${tracksCount} titres, ${artistsCount} artistes et ${albumsCount} albums mis à jour`,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
