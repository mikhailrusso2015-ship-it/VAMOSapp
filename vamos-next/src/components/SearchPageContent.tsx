"use client";

import React, { useState } from "react";
import { MapPin, Calendar, Users, Star, Clock, ChevronRight, Navigation } from "lucide-react";
import { Autocomplete, useJsApiLoader, Libraries } from "@react-google-maps/api";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

interface Ride {
  id: string;
  driver?: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  origin: string;
  destination: string;
  time: string;
  price: number;
  bsRef?: number;
  seats: number;
}

export default function SearchPageContent() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.apiKey,
    libraries: GOOGLE_MAPS_CONFIG.libraries as Libraries,
  });

  const fetchRides = async () => {
    setLoading(true);
    setSearchInitiated(true);
    try {
      const q = query(collection(db, "trips"), orderBy("createdAt", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const fetchedRides = querySnapshot.docs.map(document => {
        const data = document.data() as any;
        return {
          id: document.id,
          driver: data.driver,
          origin: data.origin || "Ubicación desconocida",
          destination: data.destination || "Destino desconocido",
          time: data.time || "Sin hora",
          price: data.price || 0,
          bsRef: data.bsRef,
          seats: data.seats || 0
        } as Ride;
      });
      setRides(fetchedRides);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock initial rides
  const mockRides: Ride[] = [
    {
      id: "mock1",
      driver: { name: "Mikhail R.", avatar: "https://i.pravatar.cc/150?u=mikhail", verified: true },
      origin: "Guacara",
      destination: "Caracas",
      time: "6:00 AM",
      price: 15,
      bsRef: 540,
      seats: 2,
    }
  ];

  const displayedRides = rides.length > 0 ? rides : (searchInitiated ? [] : mockRides);

  return (
    <div className="flex flex-col min-h-screen bg-[#040521] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">VAMOS</h1>
        <p className="text-[#62AAE5] text-[10px] font-bold uppercase tracking-[0.2em]">Buscador de Rutas Premium</p>
      </div>

      {/* Main Search Card */}
      <div className="px-6">
        <div className="neu-card rounded-[32px] overflow-hidden mb-10 p-2 border border-white/5">
          <div className="flex flex-col gap-0">
            {isLoaded ? (
              <>
                <Autocomplete restrictions={{ country: "ve" }}>
                    <div className="flex items-center gap-4 p-5 border-b border-white/5 bg-white/5 rounded-t-2xl">
                        <Navigation size={22} className="text-[#62AAE5]" />
                        <div className="flex-1">
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Donde estas</p>
                            <input type="text" placeholder="Origen" className="bg-transparent border-none p-0 w-full text-white text-base font-bold focus:ring-0" />
                        </div>
                    </div>
                </Autocomplete>
                
                <Autocomplete restrictions={{ country: "ve" }}>
                    <div className="flex items-center gap-4 p-5 border-b border-white/5">
                        <MapPin size={22} className="text-[#62AAE5]" />
                        <div className="flex-1">
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">A donde vas</p>
                            <input type="text" placeholder="Destino" className="bg-transparent border-none p-0 w-full text-white text-base font-bold focus:ring-0" />
                        </div>
                    </div>
                </Autocomplete>
              </>
            ) : (
                <div className="flex flex-col gap-2 p-10 items-center justify-center opacity-40">
                    <div className="w-6 h-6 border-2 border-[#62AAE5] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center">Iniciando Mapas...</p>
                </div>
            )}
          </div>

          <div className="grid grid-cols-2">
            <div className="flex items-center gap-4 p-5 border-r border-white/5">
              <Calendar size={18} className="text-white/40" />
              <div className="flex-1">
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Cuando</p>
                <span className="text-white text-sm font-bold uppercase">Hoy</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5">
              <Users size={18} className="text-white/40" />
              <div className="flex-1">
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Asientos</p>
                <span className="text-white text-sm font-bold">1 Plazo</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <button 
              onClick={fetchRides}
              disabled={loading}
              className="w-full bg-[#62AAE5] text-white py-5 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? "Buscando..." : "Buscar Viaje"}
            </button>
          </div>
        </div>
      </div>

      {/* Map Preview */}
      <div className="px-6 mb-10 h-48">
        <div className="neu-card rounded-[32px] overflow-hidden h-full border border-white/5 relative">
            <GoogleMapComponent isLoaded={isLoaded} loadError={loadError} />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest">En Vivo</div>
        </div>
      </div>

      {/* Viajes Disponibles */}
      <div className="px-6 pb-10">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight italic">Viajes Disponibles</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-[#62AAE5] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayedRides.map((ride: Ride) => (
            <div key={ride.id} className="neu-flat rounded-[32px] p-6 border border-white/5 active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-[#62AAE5] bg-cover bg-center" 
                      style={{ backgroundImage: `url(${ride.driver?.avatar || "https://i.pravatar.cc/150?u=user"})` }}
                    />
                    {ride.driver?.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-[#62AAE5] rounded-full p-1 border-2 border-[#040521]">
                        <ChevronRight size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-black text-white">{ride.driver?.name || "Conductor"}</p>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-[#F59A2F] fill-[#F59A2F]" />
                      <span className="text-[10px] text-white/60 font-medium">4.9 • Premium</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#F59A2F] leading-none">{ride.price}$</p>
                  <p className="text-[9px] text-white/40 mt-1.5 font-black uppercase">Ref. {ride.bsRef || (ride.price * 36)} Bs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 py-4 bg-white/5 rounded-2xl px-5 border border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[#62AAE5]" />
                  <div className="w-[1px] h-6 bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#62AAE5]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-white mb-4 uppercase tracking-tight">{ride.origin}</p>
                  <p className="text-xs font-black text-white uppercase tracking-tight">{ride.destination}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#62AAE5] bg-[#62AAE5]/10 px-2 py-0.5 rounded-full">
                    <Clock size={12} />
                    <span className="text-[10px] font-black">{ride.time}</span>
                  </div>
                  <span className="text-[9px] bg-white/5 px-2 py-1 rounded-md text-white/40 font-black uppercase tracking-tighter">
                    {ride.seats} Libres
                  </span>
                </div>
              </div>
            </div>
          ))}
          {!loading && searchInitiated && rides.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <p className="text-xs font-black uppercase tracking-widest text-white">No se encontraron viajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
