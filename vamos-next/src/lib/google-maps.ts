/**
 * CONFIGURACIÓN GOOGLE MAPS - INTEGRACIÓN NATIVA
 * API Key proporcionada para VAMOSapp: AIzaSyBXjq_GPzOx2OdIjA1k7haQ-4XieYf78qc
 * Librerías activas: places, directions, geocoding
 */

export const GOOGLE_MAPS_CONFIG = {
  apiKey: "AIzaSyBXjq_GPzOx2OdIjA1k7haQ-4XieYf78qc",
  libraries: ["places", "geometry", "drawing"] as any[],
  region: "VE", // Restricción a Venezuela
  language: "es",
};

export const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places", "geometry"];

// Script URL centralizado para carga nativa
export const getGoogleMapsScriptUrl = () => {
    return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places,geometry&region=VE&language=es`;
};
