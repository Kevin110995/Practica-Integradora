// src/services/mapboxService.js
import mapboxgl from 'mapbox-gl';

// Leemos el token del archivo .env
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

let map = null;
let marker = null;

// 1. Inicializar el Mapa
export const initMap = (containerId) => {
    map = new mapboxgl.Map({
        container: containerId, // ID del div en el HTML
        style: 'mapbox://styles/mapbox/dark-v11', // Estilo oscuro moderno
        center: [-99.1332, 19.4326], // CDMX por defecto
        zoom: 12,
        attributionControl: false
    });
    
    // Controles de navegación (+/-)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
};

// 2. Buscar Coordenadas (Geocoding)
export const getCoordinates = async (city) => {
    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}&limit=1`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.features && data.features.length > 0) {
            return data.features[0].center; // Retorna [longitud, latitud]
        }
        throw new Error("Ciudad no encontrada en el mapa.");
    } catch (error) {
        console.error(error);
        return null;
    }
};

// 3. Mover el mapa y poner un pin
export const flyToLocation = (coords) => {
    if (!map) return;

    // Animación de vuelo
    map.flyTo({
        center: coords,
        zoom: 14,
        essential: true
    });

    // Si ya hay un marcador, lo quitamos para poner el nuevo
    if (marker) marker.remove();

    // Crear nuevo marcador rojo
    marker = new mapboxgl.Marker({ color: '#E63946' })
        .setLngLat(coords)
        .addTo(map);
};