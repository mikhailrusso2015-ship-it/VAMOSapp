"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Car, Users, ArrowRight } from "lucide-react";

export default function GatewayPage() {
  const router = useRouter();

  // SLA v2.2: Protocolo de Continuidad - No pedir rol si ya existe sesión
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const checkSession = async () => {
      if (savedRole) {
        // Si hay un rol guardado, asumimos que el usuario ya pasó por aquí
        router.push(savedRole === "driver" ? "/publish" : "/search");
      }
    };
    checkSession();
  }, [router]);

  const handleSelection = (role: "passenger" | "driver") => {
    localStorage.setItem("userRole", role);
    router.push("/auth");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#040521] px-6 py-12 justify-center">
      {/* Header / Logo Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black tracking-tighter text-white mb-2 italic drop-shadow-[0_0_15px_rgba(98,170,229,0.3)]">
          VAMOS
        </h1>
        <p className="text-[#62AAE5] text-xs font-bold uppercase tracking-[0.3em]">
          Premium Carpooling Venezuela
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="space-y-6">
        <h2 className="text-white/60 text-[10px] font-black uppercase tracking-widest text-center mb-4">
          Selecciona tu modo de viaje
        </h2>

        {/* Passenger Option */}
        <button
          onClick={() => handleSelection("passenger")}
          className="w-full neu-card rounded-[32px] p-8 text-left group active:scale-[0.98] transition-all border border-white/5 hover:border-[#62AAE5]/30"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#62AAE5]/10 flex items-center justify-center text-[#62AAE5] group-hover:bg-[#62AAE5] group-hover:text-white transition-colors duration-300">
              <Users size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-1">Pasajero</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-tight">Busco un viaje cómodo</p>
            </div>
            <ArrowRight className="text-white/20 group-hover:text-[#62AAE5] group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        {/* Driver Option */}
        <button
          onClick={() => handleSelection("driver")}
          className="w-full neu-card rounded-[32px] p-8 text-left group active:scale-[0.98] transition-all border border-white/5 hover:border-[#F59A2F]/30"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#F59A2F]/10 flex items-center justify-center text-[#F59A2F] group-hover:bg-[#F59A2F] group-hover:text-white transition-colors duration-300">
              <Car size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-1">Chofer</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-tight">Quiero publicar una ruta</p>
            </div>
            <ArrowRight className="text-white/20 group-hover:text-[#F59A2F] group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-20 text-center">
        <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
          Conectando Venezuela con <br /> seguridad y estilo premium
        </p>
      </div>
    </div>
  );
}
