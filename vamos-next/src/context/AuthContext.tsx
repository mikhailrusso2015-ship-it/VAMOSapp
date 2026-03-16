"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  getRedirectResult,
  User, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Manejar resultado de redirección (Mobile friendly)
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const user = result.user;
          const pendingRole = localStorage.getItem("pendingRole") || "passenger";
          
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: pendingRole,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          localStorage.removeItem("pendingRole");
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }
    };

    handleRedirect();

    // 2. Escuchar cambios en el estado de autenticación (Firebase nativo)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // RESET TOTAL: Si no hay usuario, limpiar estado inmediatamente
        setUser(null);
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      
      // Limpieza atómica de persistencia local
      localStorage.removeItem("userRole");
      localStorage.removeItem("pendingRole");
      sessionStorage.clear();
      
      // RESET LOCAL STATE
      setUser(null);

      // Forzar redirección al gateway principal para evitar estados residuales
      window.location.replace("/");
    } catch (error) {
      console.error("Critical Auth Error during SignOut:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading ? children : (
        <div className="fixed inset-0 bg-[#040521] flex items-center justify-center z-[9999]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#62AAE5] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#62AAE5] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
              Sincronizando Perfil...
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
