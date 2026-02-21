// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- PEGA AQUÍ EL OBJETO QUE COPIASTE DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBtmw4KCWnEhHWawyacF2HfhZNiP_yjNMM",
  authDomain: "cityvibe-app-eb721.firebaseapp.com",
  projectId: "cityvibe-app-eb721",
  storageBucket: "cityvibe-app-eb721.firebasestorage.app",
  messagingSenderId: "642634640824",
  appId: "1:642634640824:web:e30103f7dd0933a397f34d"
};
// ----------------------------------------------------

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para guardar historial
export const saveSearchHistory = async (city) => {
    try {
        const docRef = await addDoc(collection(db, "historial_busquedas"), {
            ciudad: city,
            fecha: serverTimestamp(), // Guarda la hora exacta del servidor
            plataforma: "CityVibe Web",
            usuario: "demo_user" // Simulamos un usuario
        });
        console.log("Historial guardado con ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error guardando en Firebase: ", e);
        return false;
    }
};