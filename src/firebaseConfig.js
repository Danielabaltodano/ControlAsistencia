// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxxsyOFZTrg414QmQbwZ8D4wYH_KU7Z00",
  authDomain: "control-de-asistencia-4b1a0.firebaseapp.com",
  projectId: "control-de-asistencia-4b1a0",
  storageBucket: "control-de-asistencia-4b1a0.appspot.com",
  messagingSenderId: "162892298576",
  appId: "1:162892298576:web:2c98372e5f6988337d9455",
  measurementId: "G-E8S67ZF5PF"
};

// Inicializar Firebase solo si no ha sido inicializado previamente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exportar Firestore y Storage para usar en otros módulos
export const db = getFirestore(app);
export const storage = getStorage(app);
