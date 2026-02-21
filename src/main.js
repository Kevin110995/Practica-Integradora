import './assets/style.css';
import { saveSearchHistory } from './services/firebaseConfig.js';
import { initMap, getCoordinates, flyToLocation } from './services/mapboxService.js';
import { searchPlaylists } from './services/spotifyService.js';
import { getRedditPosts } from './services/redditService.js';

// 1. ESTRUCTURA HTML (3 COLUMNAS)
document.querySelector('#app').innerHTML = `
<div class="container-fluid vh-100 d-flex flex-column p-0 bg-dark text-white">
    
    <nav class="navbar navbar-dark bg-black border-bottom border-secondary px-4" style="height: 60px;">
        <span class="navbar-brand mb-0 h1 text-success fw-bold">
            <i class="bi bi-globe-americas"></i> CityVibe
        </span>
        <div class="d-flex gap-2 w-50">
            <input id="cityInput" class="form-control bg-dark text-white border-secondary" type="search" placeholder="Escribe ciudad (ej. Guanajuato)...">
            <button id="btnSearch" class="btn btn-success">Ir</button>
        </div>
    </nav>

    <div class="row flex-grow-1 m-0 overflow-hidden">
        
        <div class="col-md-6 p-0 border-end border-secondary position-relative">
            <div id="map" style="width: 100%; height: 100%; min-height: 400px;"></div>
        </div>

        <div class="col-md-3 bg-dark p-0 border-end border-secondary d-flex flex-column">
            <div class="p-3 border-bottom border-secondary bg-black">
                <h6 class="m-0 text-danger"><i class="bi bi-reddit"></i> Discusión Social</h6>
            </div>
            <div id="redditFeed" class="p-3 overflow-auto flex-grow-1">
                <p class="text-muted small text-center mt-5">Busca una ciudad para ver qué dice la gente.</p>
            </div>
        </div>

        <div class="col-md-3 bg-dark p-0 d-flex flex-column">
            <div class="p-3 border-bottom border-secondary bg-black">
                <h6 class="m-0 text-success"><i class="bi bi-spotify"></i> Música Local</h6>
            </div>
            <div id="spotifyFeed" class="p-3 overflow-auto flex-grow-1">
                <p class="text-muted small text-center mt-5">El ritmo de la ciudad aparecerá aquí.</p>
            </div>
        </div>

    </div>
</div>
`;

// Inicializamos Mapa al cargar la página
setTimeout(() => {
    initMap('map');
}, 500);

// 2. LÓGICA PRINCIPAL DE BÚSQUEDA
const handleSearch = async () => {
    const city = document.querySelector('#cityInput').value;
    if (!city) return;

    const btn = document.querySelector('#btnSearch');
    btn.textContent = "...";
    btn.disabled = true;

    // Guardar en Firebase (historial)
    saveSearchHistory(city);

    try {
        // A. MAPBOX
        try {
            const coords = await getCoordinates(city);
            if (coords) flyToLocation(coords);
        } catch (e) { 
            console.log("Error mapa:", e); 
        }

        // B. REDDIT
        const posts = await getRedditPosts(city);
        renderReddit(posts);

        // C. SPOTIFY
        try {
            const playlists = await searchPlaylists(city);
            renderSpotify(playlists);
        } catch (e) { 
            console.log("Error spotify:", e); 
        }

    } catch (error) {
        console.error("Error crítico en la búsqueda:", error);
    } finally {
        btn.textContent = "Ir";
        btn.disabled = false;
    }
};

// 3. RENDERIZADORES (Pintar datos en pantalla)
const renderReddit = (posts) => {
    const container = document.querySelector('#redditFeed');
    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = `<p class="text-muted small p-3">No se encontraron discusiones recientes.</p>`;
        return;
    }

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = "card mb-3 bg-secondary text-white border-0 shadow-sm mx-2 mt-2";
        card.innerHTML = `
            <div class="card-body p-3">
                <div class="mb-1">
                    <span class="badge bg-danger">${post.subreddit}</span>
                </div>
                <h6 class="card-title small fw-bold">
                    <a href="${post.url}" target="_blank" class="text-info text-decoration-none">
                        ${post.title}
                    </a>
                </h6>
                <div class="d-flex justify-content-between small text-white-50 mt-2 border-top border-dark pt-2">
                    <span><i class="bi bi-person"></i> u/${post.author}</span>
                    <span><i class="bi bi-arrow-up-circle-fill text-warning"></i> ${post.score} votos</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
};

const renderSpotify = (playlists) => {
    const container = document.querySelector('#spotifyFeed');
    container.innerHTML = "";
    
    if(!playlists || playlists.length === 0) {
        container.innerHTML = "<p class='small text-muted p-3'>No hay playlists disponibles.</p>";
        return;
    }

    playlists.forEach(p => {
        const div = document.createElement('div');
        div.className = "mx-2 mt-2";
        // URL corregida con el símbolo $ y el enlace oficial de embed de Spotify
        div.innerHTML = `
            <iframe 
                style="border-radius:12px;" 
                src="https://open.spotify.com/embed/playlist/${p.id}?utm_source=generator&theme=0" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        `;
        container.appendChild(div);
    });
};

// Escuchar los clicks y el botón "Enter"
document.querySelector('#btnSearch').addEventListener('click', handleSearch);
document.querySelector('#cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});