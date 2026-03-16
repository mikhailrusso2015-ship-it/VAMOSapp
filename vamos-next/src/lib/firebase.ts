import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * CONFIGURACIÓN VAMOSAPP - INTEGRACIÓN NATIVA EXTRACTADA
 * Estas credenciales provienen del entorno homologado vinculado a mikhail.russo2015@gmail.com
 * Se han hardcodeado para asegurar "Cero variables vacías" y conectividad inmediata.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDbGpOieVWF6JC7y1cecIjhH94zoxiiiHU",
  authDomain: "vamosapp-cc81a.firebaseapp.com",
  projectId: "vamosapp-cc81a",
  storageBucket: "vamosapp-cc81a.firebasestorage.app",
  messagingSenderId: "727622184254",
  appId: "1:727622184254:web:25d49e84dc4193d58d506f"
};

// Inicializar Firebase (Singleton pattern para Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
