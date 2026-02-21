import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

export default defineConfig({
  define: {
    'process.env': process.env
  },
  server: {
    port: 3000 // Usaremos el puerto 3000
  }
});