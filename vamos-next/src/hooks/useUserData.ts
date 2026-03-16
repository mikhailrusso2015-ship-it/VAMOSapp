"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "passenger" | "driver";
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * HOOK DE DATOS EN TIEMPO REAL - AUDITORÍA VAMOSAPP v2.2
 * Proporciona sincronización atómica con Firestore.
 */
export function useUserData(uid: string | undefined) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(!!uid);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`[useUserData] Iniciando listener para: ${uid}`);

    // Listener en tiempo real con OnSnapshot
    const unsub = onSnapshot(
      doc(db, "users", uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.data() as UserData);
        } else {
          setUserData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[useUserData] Error crítico:", err);
        setError(err);
        setLoading(false);
      }
    );

    // CLEANUP AUTOMÁTICO: Destruye el listener si el uid cambia o el componente se desmonta
    return () => {
      console.log(`[useUserData] Limpiando listener para: ${uid}`);
      unsub();
    };
  }, [uid]);

  return { userData, loading, error };
}
