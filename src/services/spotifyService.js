// src/services/spotifyService.js

// Credenciales desde .env
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// 1. Obtener Token (Privado)
const _getToken = async () => {
    try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    } catch (error) {
        console.error("Error autenticando Spotify", error);
        return null;
    }
};

// 2. Buscar Playlists por Ciudad (Público)
export const searchPlaylists = async (city) => {
    const token = await _getToken();
    if (!token) return [];

    try {
        // Buscamos playlists que coincidan con la ciudad
        const query = encodeURIComponent(city);
        const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=4`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items; // Devolvemos la lista de playlists
    } catch (error) {
        console.error("Error buscando música", error);
        return [];
    }
};