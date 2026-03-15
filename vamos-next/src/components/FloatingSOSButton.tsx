"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, MapPin, Send, PhoneCall } from "lucide-react";

const FloatingSOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const constraintsRef = useRef(null);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      >
        <motion.button
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: "calc(100vw - 80px)", y: "calc(100vh - 160px)" }}
          className="pointer-events-auto absolute w-16 h-16 bg-[#F59A2F] rounded-full shadow-[0_0_25px_rgba(245,154,47,0.6)] border-4 border-[#040521] flex items-center justify-center text-white font-bold cursor-grab transition-all"
          onClick={toggleModal}
        >
          <div className="flex flex-col items-center justify-center leading-none">
            <ShieldAlert size={24} className="mb-0.5" />
            <span className="text-[10px] uppercase font-black tracking-tight">SOS</span>
          </div>
          
          {/* External Pulse Ring */}
          <div className="absolute inset-0 rounded-full animate-ping bg-[#F59A2F] opacity-30 -z-10" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#040521]/95 backdrop-blur-xl z-[10000] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="neu-card rounded-[40px] w-full max-w-[340px] p-8 border border-[#F59A2F]/30"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-[#F59A2F]/20 rounded-2xl flex items-center justify-center">
                  <ShieldAlert size={32} className="text-[#F59A2F]" />
                </div>
                <button 
                  onClick={toggleModal}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Modo de Emergencia</h3>
              <p className="text-sm font-bold text-[#F59A2F] mb-6 animate-pulse uppercase tracking-[0.1em]">
                Simulación: Enviando ubicación GPS...
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                  <MapPin size={20} className="text-[#62AAE5]" />
                  <div className="flex-1">
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Tu ubicación actual</p>
                    <p className="text-xs font-bold text-white">Guacara, Valencia - Edo. Carabobo</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                  <Send size={20} className="text-[#10B981]" />
                  <div className="flex-1">
                    <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Alerta enviada a:</p>
                    <p className="text-xs font-bold text-white">4 Contactos de confianza</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert("🚨 Llamando a servicios de emergencia (171)...")}
                className="w-full bg-[#dc2626] text-white py-5 rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <PhoneCall size={22} />
                <span>LLAMAR 171</span>
              </button>
              
              <p className="text-center mt-6 text-[9px] text-white/20 font-black uppercase tracking-widest">
                Presiona X para cancelar la alerta
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSOSButton;
