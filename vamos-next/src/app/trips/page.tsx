"use client";

import React, { useState } from "react";
import { Car, Search, Briefcase, History } from "lucide-react";
import Link from "next/link";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<"reserved" | "offered">("reserved");

  return (
    <div className="flex flex-col min-h-full px-6 pt-12 pb-24">
      {/* Header & Toggle */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight italic">Mis Viajes</h2>
        
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("reserved")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "reserved" ? "bg-[#62AAE5] text-white shadow-lg" : "text-white/40"
            }`}
          >
            Reservados
          </button>
          <button
            onClick={() => setActiveTab("offered")}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "offered" ? "bg-[#F59A2F] text-white shadow-lg" : "text-white/40"
            }`}
          >
            Ofrecidos
          </button>
        </div>
      </div>

      {/* Content based on Active Tab */}
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
        {activeTab === "reserved" ? (
          <>
            <div className="w-32 h-32 rounded-full neu-flat flex items-center justify-center text-[#62AAE5]/20">
              <Search size={64} strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">No has reservado nada</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Tus próximos viajes como pasajero aparecerán aquí.
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 bg-[#62AAE5] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              <Search size={18} />
              <span>Buscar Viaje</span>
            </Link>
          </>
        ) : (
          <>
            <div className="w-32 h-32 rounded-full neu-flat flex items-center justify-center text-[#F59A2F]/20">
              <Car size={64} strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">No estás ofreciendo viajes</h3>
              <p className="text-sm text-white/40 leading-relaxed font-medium">
                Publica un viaje y empieza a ganar dinero compartiendo gastos.
              </p>
            </div>
            <Link
              href="/publish"
              className="flex items-center gap-2 bg-[#F59A2F] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              <Briefcase size={18} />
              <span>Publicar Viaje</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
