"use client";

import React, { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "24px",
};

const center = {
  lat: 10.2469, // Guacara, Venezuela
  lng: -67.8831,
};

// Estilo Dark Premium para el Mapa
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

interface Props {
  onLoad?: (map: google.maps.Map) => void;
  onUnmount?: (map: google.maps.Map) => void;
}

const GoogleMapComponent: React.FC<Props> = ({ onLoad, onUnmount }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleOnLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    if (onLoad) onLoad(map);
  }, [onLoad]);

  const handleOnUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
    if (onUnmount) onUnmount(map);
  }, [onUnmount]);

  if (loadError) {
    return (
      <div className="w-full h-full bg-red-500/10 border-2 border-red-500/20 rounded-[24px] flex flex-col items-center justify-center p-6 text-center">
        <span className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">Error de Configuración</span>
        <p className="text-white/60 text-[9px] font-bold uppercase leading-relaxed max-w-[200px]">
          Google Maps no puede cargar. Verifica que las APIs (Maps, Places, Directions) estén habilitadas y la facturación esté activa en Google Cloud.
        </p>
      </div>
    );
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={handleOnLoad}
      onUnmount={handleOnUnmount}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: false,
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <div className="w-full h-full bg-white/5 animate-pulse rounded-[24px] flex items-center justify-center">
        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Cargando Mapa...</span>
    </div>
  );
};

export default React.memo(GoogleMapComponent);
