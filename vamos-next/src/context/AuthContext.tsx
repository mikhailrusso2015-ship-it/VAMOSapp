"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

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
    // Escuchar cambios en el estado de autenticación (Firebase nativo)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      
      // Limpieza atómica de persistencia local
      localStorage.clear();
      sessionStorage.clear();
      
      // Forzar redirección al gateway principal para evitar estados residuales
      window.location.replace("/");
    } catch (error) {
      console.error("Critical Auth Error during SignOut:", error);
    } finally {
      // No seteamos loading false aquí porque location.replace recargará la app
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
