"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

export const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "24px",
};

export const center = {
  lat: 10.2469, // Guacara, Venezuela
  lng: -67.8831,
};

// Estilo Dark Premium para el Mapa
export const darkMapStyle = [
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
  isLoaded: boolean;
  loadError: any;
  onLoad?: (map: google.maps.Map) => void;
  onUnmount?: (map: google.maps.Map) => void;
  onAddressChange?: (address: string, location: google.maps.LatLngLiteral) => void;
  center?: google.maps.LatLngLiteral;
  draggable?: boolean;
}

// Sistema de Caché Local para destinos frecuentes
const addressCache: Record<string, string> = {};

const GoogleMapComponent: React.FC<Props> = ({ 
  isLoaded, 
  loadError, 
  onLoad, 
  onUnmount,
  onAddressChange,
  center: initialCenter,
  draggable = false
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>(initialCenter || center);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPos(newPos);
      
      // Implementación de Debounce (800ms) para Geocoding - Estabilidad v2.1
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      
      debounceTimerRef.current = setTimeout(() => {
        reverseGeocode(newPos);
      }, 800);
    }
  };

  const reverseGeocode = (pos: google.maps.LatLngLiteral) => {
    const cacheKey = `${pos.lat.toFixed(4)},${pos.lng.toFixed(4)}`;
    
    // Check Cache
    if (addressCache[cacheKey]) {
      console.log("[MapsCache] Hit:", addressCache[cacheKey]);
      if (onAddressChange) onAddressChange(addressCache[cacheKey], pos);
      return;
    }

    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location: pos }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          addressCache[cacheKey] = address; // Guardar en caché
          if (onAddressChange) onAddressChange(address, pos);
        }
      });
    }
  };

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
      center={initialCenter || center}
      zoom={14}
      onLoad={handleOnLoad}
      onUnmount={handleOnUnmount}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: draggable ? "greedy" : "cooperative",
      }}
    >
      {draggable && (
        <Marker 
          position={markerPos} 
          draggable={true} 
          onDragEnd={handleDragEnd}
          animation={google.maps.Animation.DROP}
        />
      )}
    </GoogleMap>
  ) : (
    <div className="w-full h-full bg-white/5 animate-pulse rounded-[24px] flex items-center justify-center">
        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Cargando Mapa...</span>
    </div>
  );
};

export default React.memo(GoogleMapComponent);
