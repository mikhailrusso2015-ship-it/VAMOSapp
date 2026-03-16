/**
 * CONFIGURACIÓN GOOGLE MAPS - INTEGRACIÓN NATIVA
 * API Key autorizada para VAMOSapp (vamosapp-cc81a)
 */

import { Libraries } from "@react-google-maps/api";

export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDbGpOieVWF6JC7y1cecIjhH94zoxiiiHU",
  libraries: ["places", "geometry", "drawing"] as Libraries,
  region: "VE",
  language: "es",
};

export const GOOGLE_MAPS_LIBRARIES: Libraries = ["places", "geometry"];

// Script URL centralizado para carga nativa
export const getGoogleMapsScriptUrl = () => {
    return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places,geometry&region=VE&language=es`;
};
