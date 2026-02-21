// src/services/redditService.js

export const getRedditPosts = async (city) => {
    try {
        // Codificamos el nombre de la ciudad (ej. "Nueva York" -> "Nueva%20York")
        const query = encodeURIComponent(city);
        
        // Hacemos la petición real al endpoint de búsqueda de Reddit
        const url = `https://www.reddit.com/search.json?q=${query}&limit=6&sort=hot`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Reddit devuelve un árbol JSON muy profundo. 
        // Entramos a data -> children y mapeamos solo lo que necesitamos.
        const posts = data.data.children.map(child => {
            const post = child.data;
            return {
                title: post.title,
                author: post.author,
                score: post.score,
                url: `https://www.reddit.com${post.permalink}`,
                subreddit: post.subreddit_name_prefixed // ej. r/travel
            };
        });

        return posts; // Retornamos los datos reales

    } catch (error) {
        console.error("Fallo la conexión con Reddit API:", error);
        // Si hay error (ej. sin internet), retornamos un arreglo vacío, NUNCA datos falsos.
        return []; 
    }
};