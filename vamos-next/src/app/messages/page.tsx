"use client";

import React from "react";
import { MessageSquare, Send } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-10 text-center space-y-6 pt-20">
      <div className="w-32 h-32 rounded-full neu-flat flex items-center justify-center text-white/10">
        <MessageSquare size={64} strokeWidth={1} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Cero mensajes</h2>
        <p className="text-sm text-white/40 leading-relaxed font-medium">
          Aquí aparecerán tus chats con conductores y pasajeros. ¡No te quedes con la duda y pregunta!
        </p>
      </div>
      <button 
        onClick={() => window.location.href = "/trips"}
        className="flex items-center gap-2 bg-[#62AAE5] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
      >
        <Send size={18} />
        <span>Iniciar un chat</span>
      </button>
    </div>
  );
}
