"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, History, ChevronRight, ArrowRight, Star, Clock } from "lucide-react";

export default function HomePage() {
  const [rides] = useState([
    {
      id: 1,
      driver: { name: "Mikhail R.", avatar: "https://i.pravatar.cc/150?u=mikhail", verified: true },
      origin: "Guacara",
      destination: "Caracas",
      time: "6:00 AM",
      price: 15,
      bsRef: 540,
      seats: 2,
    },
    {
      id: 2,
      driver: { name: "Ana P.", avatar: "https://i.pravatar.cc/150?u=ana", verified: true },
      origin: "Valencia",
      destination: "Maracay",
      time: "2:00 PM",
      price: 5,
      bsRef: 180,
      seats: 3,
    },
  ]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-4xl font-black tracking-tighter text-white mb-2 italic">VAMOS</h1>
        <p className="text-[#62AAE5] text-[10px] font-bold uppercase tracking-[0.2em]">Premium Carpooling Venezuela</p>
      </div>

      {/* Main Search Card */}
      <div className="px-6">
        <div className="neu-card rounded-[32px] overflow-hidden mb-10 p-2">
          <div className="flex items-center gap-4 p-4 border-b border-white/5 bg-white/5 rounded-t-2xl">
            <MapPin size={22} className="text-[#62AAE5]" />
            <div className="flex-1">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Origen</p>
              <input type="text" defaultValue="Guacara" className="bg-transparent border-none p-0 w-full text-white text-base font-bold focus:ring-0" />
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-b border-white/5">
            <Search size={22} className="text-[#62AAE5]" />
            <div className="flex-1">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Hacia</p>
              <input type="text" placeholder="¿A dónde vas?" className="bg-transparent border-none p-0 w-full text-white text-base font-bold focus:ring-0" />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex items-center gap-4 p-4 border-r border-white/5">
              <Calendar size={18} className="text-white/40" />
              <div className="flex-1">
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Cuando</p>
                <span className="text-white text-sm font-bold">Hoy</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <Users size={18} className="text-white/40" />
              <div className="flex-1">
                <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-0.5">Plazas</p>
                <span className="text-white text-sm font-bold">1 pers.</span>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button className="w-full bg-[#62AAE5] text-white py-4 rounded-2xl font-black text-base shadow-xl active:scale-95 transition-all">
              Buscar Viaje
            </button>
          </div>
        </div>
      </div>

      {/* Viajes Disponibles */}
      <div className="px-6 pb-10">
        <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Viajes Disponibles Hoy</h2>
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="neu-flat rounded-3xl p-5 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={ride.driver.avatar} className="w-10 h-10 rounded-full border-2 border-[#62AAE5]" alt={ride.driver.name} />
                    {ride.driver.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-[#62AAE5] rounded-full p-0.5 border-2 border-[#081D56]">
                        <ChevronRight size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{ride.driver.name}</p>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-[#F59A2F] fill-[#F59A2F]" />
                      <span className="text-[10px] text-white/60">4.9 • Conductor Premium</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#F59A2F] leading-none">{ride.price}$</p>
                  <p className="text-[9px] text-white/40 mt-1 font-bold italic">Ref. {ride.bsRef} Bs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 py-3 bg-white/5 rounded-2xl px-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full border-2 border-[#62AAE5]" />
                  <div className="w-[1px] h-4 bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-[#62AAE5]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white mb-3">{ride.origin}</p>
                  <p className="text-xs font-bold text-white">{ride.destination}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-[#62AAE5]">
                    <Clock size={12} />
                    <span className="text-[10px] font-black">{ride.time}</span>
                  </div>
                  <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-white/60 font-bold">
                    {ride.seats} asientos libres
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
