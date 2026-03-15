"use client";

import React, { useState } from "react";
import { Plus, Minus, Wallet, Landmark, Banknote, ShieldCheck } from "lucide-react";

export default function PublishPage() {
  const [price, setPrice] = useState(15);
  const [selectedMethods, setSelectedMethods] = useState(["Pago Móvil Bs"]);

  const methods = ["Pago Móvil Bs", "Zelle", "Efectivo Exacto", "Binance Pay"];

  const toggleMethod = (method: string) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter((m) => m !== method));
    } else {
      setSelectedMethods([...selectedMethods, method]);
    }
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-12 pb-10">
      <h2 className="text-xl font-black text-white text-center mb-10 uppercase tracking-tight">Fija el aporte sugerido</h2>

      {/* Price Control */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="flex items-center gap-10">
          <button
            onClick={() => setPrice(Math.max(1, price - 1))}
            className="w-16 h-16 rounded-full neu-flat flex items-center justify-center text-[#62AAE5] active:scale-90 transition-all"
          >
            <Minus size={32} strokeWidth={3} />
          </button>
          <div className="flex items-end gap-1">
            <span className="text-7xl font-black text-white">{price}</span>
            <span className="text-3xl font-bold text-[#62AAE5] mb-2">$</span>
          </div>
          <button
            onClick={() => setPrice(price + 1)}
            className="w-16 h-16 rounded-full neu-flat flex items-center justify-center text-[#62AAE5] active:scale-90 transition-all"
          >
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>
        <p className="mt-6 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full">
          Recomendado: 12$ - 18$
        </p>
      </div>

      {/* Módulo Diferenciador: Métodos de Cobro */}
      <div className="neu-card rounded-[32px] p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-[#F59A2F]" size={20} />
          <h3 className="text-sm font-black text-white uppercase tracking-tight">Métodos de Cobro Aceptados</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {methods.map((method) => {
            const isSelected = selectedMethods.includes(method);
            return (
              <button
                key={method}
                onClick={() => toggleMethod(method)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${
                  isSelected
                    ? "bg-[#F59A2F] border-[#F59A2F] text-white shadow-lg"
                    : "bg-[#040521]/50 border-white/5 text-white/40 hover:border-white/20"
                }`}
              >
                {method === "Pago Móvil Bs" && <Landmark size={14} />}
                {method === "Efectivo Exacto" && <Banknote size={14} />}
                <span>{method}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-3 bg-[#62AAE5]/5 p-4 rounded-2xl italic">
          <ShieldCheck size={28} className="text-[#62AAE5] shrink-0" />
          <p className="text-[9px] text-white/50 leading-relaxed font-medium">
            Tus datos de cobro se compartirán de forma segura solo con pasajeros confirmados después de que aceptes su solicitud.
          </p>
        </div>
      </div>

      <button className="w-full bg-[#F59A2F] text-white py-5 rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(245,154,47,0.3)] active:scale-95 transition-all">
        Publicar Viaje
      </button>
    </div>
  );
}
