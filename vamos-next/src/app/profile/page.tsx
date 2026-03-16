"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UserCheck, 
  Shield, 
  Car, 
  Music, 
  PawPrint, 
  Cigarette, 
  MessageCircle, 
  Settings, 
  LogOut, 
  Camera, 
  Loader2, 
  Check,
  Phone,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { useUserData } from "@/hooks/useUserData";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "passenger",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userData, loading: dataLoading } = useUserData(user?.uid);

  // Sincronizar estado local con datos del hook
  useEffect(() => {
    if (userData) {
      const nameParts = (userData.displayName || "").split(" ");
      setProfileData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        phone: userData.phone || "",
        role: userData.role || "passenger",
      });
    }
  }, [userData]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `user_avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizar Auth Profile
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });
      
      // Actualizar Firestore
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
      
      // Actualizar Auth
      await updateProfile(auth.currentUser!, { displayName: fullName });

      // Actualizar Firestore
      await updateDoc(doc(db, "users", user.uid), {
        displayName: fullName,
        phone: profileData.phone,
        role: profileData.role,
        updatedAt: new Date().toISOString(),
      });

      localStorage.setItem("userRole", profileData.role);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifications = [
    { label: "Cédula de Identidad Verificada", color: "text-[#10B981]" },
    { label: "Selfie en tiempo real Verificada", color: "text-[#10B981]" },
    { label: profileData.phone ? `Teléfono: ${profileData.phone}` : "Teléfono: No vinculado", color: profileData.phone ? "text-[#10B981]" : "text-white/40" },
    { label: `Correo: ${user?.email || "No disponible"}`, color: "text-white/60" },
  ];

  const preferences = [
    { icon: Music, status: "off" },
    { icon: PawPrint, status: "on" },
    { icon: Cigarette, status: "off" },
    { icon: MessageCircle, status: "on" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-32 bg-[#040521]">
      {/* Header Profile */}
      <div className="px-6 pt-16 pb-10 flex flex-col items-center relative">
        {showSuccess && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#10B981] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 z-50 flex items-center gap-2">
            <Check size={14} />
            Perfil Actualizado
          </div>
        )}

        <div className="relative mb-6 group cursor-pointer" onClick={handleImageClick}>
          <div className={`w-32 h-32 rounded-full neu-card p-1 transition-all ${uploading ? 'opacity-50' : 'group-hover:scale-105'}`}>
            <img src={user?.photoURL || "https://i.pravatar.cc/150?u=anonymous"} alt={user?.displayName || "Usuario"} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white drop-shadow-lg" size={32} />
          </div>
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <Loader2 className="text-[#62AAE5] animate-spin" size={32} />
            </div>
          ) : (
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#10B981] border-4 border-[#040521] flex items-center justify-center shadow-lg">
              <Shield size={20} className="text-white" />
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        {isEditing ? (
          <div className="w-full space-y-4 animate-in fade-in duration-300">
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Nombre</p>
                <div className="neu-inset rounded-xl flex items-center px-4 h-12">
                  <UserIcon size={16} className="text-white/20 mr-2" />
                  <input 
                    type="text" 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="bg-transparent border-none focus:ring-0 w-full text-white text-sm font-bold"
                  />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Apellido</p>
                <div className="neu-inset rounded-xl flex items-center px-4 h-12">
                  <input 
                    type="text" 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="bg-transparent border-none focus:ring-0 w-full text-white text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Teléfono (WhatsApp)</p>
              <div className="neu-inset rounded-xl flex items-center px-4 h-12">
                <Phone size={16} className="text-white/20 mr-2" />
                <input 
                  type="tel" 
                  placeholder="+58 412..."
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="bg-transparent border-none focus:ring-0 w-full text-white text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Rol de Usuario</p>
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                {["passenger", "driver"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setProfileData({...profileData, role: r})}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      profileData.role === r ? "bg-[#62AAE5] text-white shadow-lg" : "text-white/40"
                    }`}
                  >
                    {r === "driver" ? "Chofer" : "Pasajero"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
               <button 
                 onClick={() => setIsEditing(false)}
                 className="flex-1 h-14 neu-card rounded-2xl text-white/40 font-bold uppercase text-[10px] tracking-widest"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleSave}
                 disabled={loading}
                 className="flex-[2] h-14 bg-[#10B981] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16}/> Guardar Cambios</>}
               </button>
            </div>
          </div>
        ) : (
          <div className="text-center animate-in fade-in duration-300">
            <h2 className="text-3xl font-black text-white leading-none tracking-tight italic uppercase">
              {user?.displayName || "Cargando..."}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3">
               <div className="bg-[#62AAE5]/10 px-4 py-1.5 rounded-full border border-[#62AAE5]/20">
                 <span className="text-[10px] font-black text-[#62AAE5] uppercase tracking-[0.2em]">
                   {profileData.role === 'driver' ? 'Socio Chofer' : 'Pasajero Premium'}
                 </span>
               </div>
            </div>
          </div>
        )}
      </div>

      <main className="px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {!isEditing && (
          <section className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Confianza Extrema</h3>
              <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full uppercase">100% Verificado</span>
            </div>
            <div className="neu-card rounded-[32px] p-6 space-y-5 border border-white/5">
              {verifications.map((v, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${v.color.includes('10B981') ? 'bg-[#10B981]/10' : 'bg-white/5'}`}>
                    <UserCheck size={16} className={v.color} />
                  </div>
                  <p className={`text-[11px] font-bold leading-tight uppercase tracking-tight ${v.color}`}>{v.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vehículo - Solo visible para Chofer o si ya tiene datos */}
        {(profileData.role === 'driver') && (
          <section>
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-1">Vehículo de Transporte</h3>
            <div className="neu-flat rounded-[32px] p-6 flex items-center gap-5 border border-white/5 shadow-inner">
              <div className="w-16 h-16 rounded-2xl bg-[#040521] flex items-center justify-center shrink-0 shadow-inner">
                <Car size={32} className="text-[#62AAE5]" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-white italic">Chevrolet Aveo</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-white/50 uppercase">Gris Metalizado</span>
                  <span className="w-1 h-1 rounded-full bg-[#62AAE5]" />
                  <span className="text-[10px] font-black text-[#62AAE5] tracking-widest">AB123CD</span>
                </div>
              </div>
              <ChevronRight className="text-white/20" size={20} />
            </div>
          </section>
        )}

        {/* Preferencias */}
        <section>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 px-1">Preferencias de Viaje</h3>
          <div className="flex justify-between items-center px-4 py-6 neu-card rounded-[32px] border border-white/5">
            {preferences.map((pref, i) => {
              const Icon = pref.icon;
              const isOn = pref.status === "on";
              return (
                <div key={i} className="relative group">
                  <div className={`w-14 h-14 rounded-full neu-flat flex items-center justify-center border-2 transition-all duration-500 scale-95 group-hover:scale-100 ${
                    isOn ? "border-[#62AAE5]/30 shadow-[0_0_20px_rgba(98,170,229,0.15)] text-[#62AAE5]" : "border-transparent text-white/10"
                  }`}>
                    <Icon size={24} />
                  </div>
                  {!isOn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                       <div className="w-10 h-0.5 bg-red-500/50 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        {!isEditing && (
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full h-16 neu-card rounded-2xl flex items-center justify-center gap-3 text-white font-bold hover:border-[#62AAE5]/20 hover:text-[#62AAE5] transition-all active:scale-95"
            >
              <Settings size={20} className="text-[#62AAE5]" />
              <span className="uppercase text-[11px] tracking-[0.2em]">Editar Datos del Perfil</span>
            </button>

            <button 
              onClick={signOut}
              className="w-full h-16 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-center gap-3 text-red-500/60 font-black active:scale-95 transition-all hover:bg-red-500/10"
            >
              <LogOut size={20} />
              <span className="uppercase text-[11px] tracking-[0.2em]">Cerrar Sesión Segura</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
