"use client";

import React from "react";
import { UserCheck, Shield, Smartphone, Mail, Car, Music, PawPrint, Cigarette, MessageCircle, ChevronRight, Settings } from "lucide-react";

export default function ProfilePage() {
  const verifications = [
    { label: "Cédula de Identidad Verificada", color: "text-[#10B981]" },
    { label: "Selfie en tiempo real Verificada", color: "text-[#10B981]" },
    { label: "Teléfono Verificado: 0412-251.70.11", color: "text-[#10B981]" },
    { label: "Correo: mikhail.russo@gmail.com", color: "text-white/60" },
  ];

  const preferences = [
    { icon: Music, status: "off" },
    { icon: PawPrint, status: "on" },
    { icon: Cigarette, status: "off" },
    { icon: MessageCircle, status: "on" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header Profile */}
      <div className="px-6 pt-16 pb-10 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full neu-card p-1">
            <img src="https://i.pravatar.cc/150?u=mikhail" alt="Mikhail Russo" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#10B981] border-4 border-[#040521] flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white leading-none">Mikhail Russo</h2>
        <div className="flex items-center gap-2 mt-2 bg-[#62AAE5]/10 px-3 py-1 rounded-full">
          <span className="text-[10px] font-black text-[#62AAE5] uppercase tracking-widest">Conductor Premium</span>
        </div>
      </div>

      <main className="px-6 space-y-8 pb-10">
        {/* Sistema de Confianza */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Confianza Extrema</h3>
            <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full uppercase">100% Verificado</span>
          </div>
          <div className="neu-card rounded-[32px] p-6 space-y-5">
            {verifications.map((v, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${v.color.includes('10B981') ? 'bg-[#10B981]/20' : 'bg-white/5'}`}>
                  <UserCheck size={14} className={v.color} />
                </div>
                <p className={`text-xs font-bold leading-tight ${v.color}`}>{v.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vehículo */}
        <section>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-1">Vehículo de Transporte</h3>
          <div className="neu-flat rounded-[32px] p-5 flex items-center gap-5 border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-[#040521] flex items-center justify-center shrink-0 shadow-inner">
              <Car size={32} className="text-[#62AAE5]" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-black text-white">Chevrolet Aveo</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold text-white/50">Gris Metalizado</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-black text-[#62AAE5]">AB1***</span>
              </div>
            </div>
          </div>
        </section>

        {/* Preferencias */}
        <section>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-1">Preferencias de Viaje</h3>
          <div className="flex justify-between items-center px-4">
            {preferences.map((pref, i) => {
              const Icon = pref.icon;
              const isOn = pref.status === "on";
              return (
                <div key={i} className="relative">
                  <div className={`w-14 h-14 rounded-full neu-flat flex items-center justify-center border-2 transition-all ${
                    isOn ? "border-[#62AAE5]/50 shadow-[0_0_15px_rgba(98,170,229,0.2)] text-[#62AAE5]" : "border-transparent text-white/20 grayscale"
                  }`}>
                    <Icon size={24} />
                  </div>
                  {!isOn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-10 h-0.5 bg-red-500/50 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Settings CTA */}
        <button className="w-full neu-card py-4 rounded-2xl flex items-center justify-center gap-2 text-white/60 font-bold hover:text-white transition-colors">
          <Settings size={18} />
          <span>Configuración de Cuenta</span>
        </button>
      </main>
    </div>
  );
}
