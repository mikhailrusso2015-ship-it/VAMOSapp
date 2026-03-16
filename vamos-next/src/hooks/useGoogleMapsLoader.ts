"use client";

import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

/**
 * HOOK DE CARGA CENTRALIZADO - AUDITORÍA VAMOSAPP
 * Garantiza que el script de Google Maps se cargue una sola vez con el ID homologado.
 */
export const useGoogleMapsLoader = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "vamos-google-maps-script", // ID único para evitar colisiones
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries as Libraries,
    language: GOOGLE_MAPS_CONFIG.language,
    region: GOOGLE_MAPS_CONFIG.region,
  });

  return { isLoaded, loadError };
};
