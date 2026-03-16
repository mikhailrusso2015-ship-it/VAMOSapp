"use client";

import React, { useState, useRef } from "react";
import { 
  Plus, 
  Minus, 
  Wallet, 
  Landmark, 
  Banknote, 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  ArrowLeft,
  Clock
} from "lucide-react";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps";

export default function PublishPageContent() {
  const { isLoaded, loadError } = useGoogleMapsLoader();

  const [step, setStep] = useState(1);
  const [price, setPrice] = useState(15);
  const [selectedMethods, setSelectedMethods] = useState(["Pago Móvil Bs"]);
  const [route, setRoute] = useState({
    origin: "",
    destination: "",
    stops: [] as string[],
  });

  const methods = ["Pago Móvil Bs", "Efectivo"];
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onOriginLoad = (autocomplete: google.maps.places.Autocomplete) => {
    originAutocompleteRef.current = autocomplete;
  };

  const onDestLoad = (autocomplete: google.maps.places.Autocomplete) => {
    destAutocompleteRef.current = autocomplete;
  };

  const onOriginChanged = () => {
    if (originAutocompleteRef.current !== null) {
      const place = originAutocompleteRef.current.getPlace();
      setRoute({ ...route, origin: place.formatted_address || "" });
    }
  };

  const onDestChanged = () => {
    if (destAutocompleteRef.current !== null) {
      const place = destAutocompleteRef.current.getPlace();
      setRoute({ ...route, destination: place.formatted_address || "" });
    }
  };

  const toggleMethod = (method: string) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter((m) => m !== method));
    } else {
      setSelectedMethods([...selectedMethods, method]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#040521]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : window.history.back()}
          className="size-10 neu-card rounded-xl flex items-center justify-center text-[#62AAE5]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center flex-1 pr-10">
          <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Publicar Viaje</h2>
          <p className="text-[#62AAE5] text-[10px] font-bold uppercase tracking-widest mt-1">Paso {step} de 2</p>
        </div>
      </div>

      {step === 1 && (
        <main className="flex-1 px-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
          <div className="space-y-6 mt-4">
            {/* Origin Input */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Punto de Partida</p>
              {isLoaded ? (
                <Autocomplete onLoad={onOriginLoad} onPlaceChanged={onOriginChanged} restrictions={{ country: "ve" }}>
                    <div className="neu-inset rounded-2xl flex items-center px-4 h-16 border border-white/5">
                    <Navigation size={20} className="text-[#62AAE5] mr-3" />
                    <input 
                        type="text" 
                        placeholder="¿De dónde sales?" 
                        className="bg-transparent border-none focus:ring-0 w-full text-white font-bold"
                    />
                    </div>
                </Autocomplete>
              ) : (
                <div className="neu-inset rounded-2xl flex items-center px-4 h-16 border border-white/5 opacity-40">
                  <div className="w-4 h-4 border-2 border-[#62AAE5] border-t-transparent rounded-full animate-spin mr-3" />
                  <span className="text-white/40 text-xs font-bold">Cargando Mapas...</span>
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Punto de Destino</p>
              {isLoaded ? (
                <Autocomplete onLoad={onDestLoad} onPlaceChanged={onDestChanged} restrictions={{ country: "ve" }}>
                    <div className="neu-inset rounded-2xl flex items-center px-4 h-16 border-2 border-[#62AAE5]/20">
                    <MapPin size={20} className="text-[#F59A2F] mr-3" />
                    <input 
                        type="text" 
                        placeholder="¿A dónde vas?" 
                        className="bg-transparent border-none focus:ring-0 w-full text-white font-bold"
                    />
                    </div>
                </Autocomplete>
              ) : (
                <div className="neu-inset rounded-2xl flex items-center px-4 h-16 border border-white/5 opacity-40">
                  <div className="w-4 h-4 border-2 border-[#62AAE5] border-t-transparent rounded-full animate-spin mr-3" />
                  <span className="text-white/40 text-xs font-bold">Cargando Mapas...</span>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="relative w-full aspect-video rounded-[32px] overflow-hidden neu-card border-4 border-white/5 group shadow-2xl">
            <GoogleMapComponent isLoaded={isLoaded} loadError={loadError} />
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
              <div className="bg-[#62AAE5] px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-tighter shadow-lg">Vista Previa de Ruta</div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-tighter flex items-center gap-1">
                <Clock size={10} />
                <span>Calculando...</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full bg-[#62AAE5] text-white py-5 rounded-[24px] font-black textsw-lg shadow-[0_10px_30px_rgba(98,170,229,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span>Continuar</span>
            <ArrowRight size={20} />
          </button>
        </main>
      )}

      {step === 2 && (
        <main className="flex-1 px-6 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
          <h2 className="text-xl font-black text-white text-center mb-4 uppercase tracking-tight">Fija el aporte sugerido</h2>

          {/* Price Control */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="flex items-center gap-10">
              <button
                onClick={() => setPrice(Math.max(1, price - 1))}
                className="w-16 h-16 rounded-full neu-flat flex items-center justify-center text-[#62AAE5] active:scale-90 transition-all border border-white/5"
              >
                <Minus size={32} strokeWidth={3} />
              </button>
              <div className="flex items-end gap-1">
                <span className="text-7xl font-black text-white italic tracking-tighter">{price}</span>
                <span className="text-3xl font-bold text-[#62AAE5] mb-2 italic">$</span>
              </div>
              <button
                onClick={() => setPrice(price + 1)}
                className="w-16 h-16 rounded-full neu-flat flex items-center justify-center text-[#62AAE5] active:scale-90 transition-all border border-white/5"
              >
                <Plus size={32} strokeWidth={3} />
              </button>
            </div>
            <p className="mt-6 text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
              Recomendado: 12$ - 18$
            </p>
          </div>

          {/* Payment Methods */}
          <div className="neu-card rounded-[32px] p-6 mb-8 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#F59A2F]/10 flex items-center justify-center text-[#F59A2F]">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Métodos de Pago</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {methods.map((method) => {
                const isSelected = selectedMethods.includes(method);
                return (
                  <button
                    key={method}
                    onClick={() => toggleMethod(method)}
                    className={`flex items-center gap-2 p-4 rounded-2xl border text-[10px] font-black uppercase transition-all ${
                      isSelected
                        ? "bg-[#62AAE5] border-[#62AAE5] text-white shadow-[0_5px_15px_rgba(98,170,229,0.3)]"
                        : "bg-[#040521]/50 border-white/10 text-white/30 hover:border-white/30"
                    }`}
                  >
                    <span>{method}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-start gap-4 bg-[#62AAE5]/5 p-5 rounded-2xl border border-[#62AAE5]/10">
              <ShieldCheck size={24} className="text-[#62AAE5] shrink-0" />
              <p className="text-[9px] text-white/50 leading-relaxed font-bold uppercase tracking-tight">
                Tus datos de cobro se compartirán de forma segura solo con pasajeros confirmados.
              </p>
            </div>
          </div>

          <button className="w-full bg-[#F59A2F] text-white py-5 rounded-[24px] font-black text-lg shadow-[0_10px_30px_rgba(245,154,47,0.4)] active:scale-95 transition-all uppercase tracking-widest">
            Publicar Viaje Ahora
          </button>
        </main>
      )}
    </div>
  );
}
