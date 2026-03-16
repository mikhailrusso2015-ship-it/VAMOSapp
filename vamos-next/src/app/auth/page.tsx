"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2, ArrowLeft, Mail as MailIcon, Lock, User, Calendar } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("passenger");
  const [view, setView] = useState<"options" | "register" | "login">("options");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") || "passenger";
    setRole(savedRole);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Operación Atómica: Verificar/Crear Perfil antes de Redirigir
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Si ya existe, solo actualizamos el último login
        await setDoc(userRef, {
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      // REDIRECCIÓN ESTRICTA: Solo después del éxito en Firestore
      const finalRole = userSnap.exists() ? (userSnap.data()?.role || role) : role;
      router.push(finalRole === "driver" ? "/publish" : "/search");

    } catch (err: any) {
      console.error("Auth Error:", err);
      setError("Error crítico de autenticación. Intenta de nuevo.");
      // Limpiar sesión si falló Firestore para evitar inconsistentemente logueados
      await auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const finishRegistration = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // Registro Atómico en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        birthDate: formData.birthDate,
        role: role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Redirección Segura
      router.push(role === "driver" ? "/publish" : "/search");

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || "Error al crear la cuenta.");
      await auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#040521] px-6 py-12">
      <button 
        onClick={() => view === "options" ? router.push("/") : setView("options")}
        className="size-10 neu-card rounded-xl flex items-center justify-center text-[#62AAE5] mb-8 active:scale-95"
      >
        <ArrowLeft size={20} />
      </button>

      {view === "options" && (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center gap-6">
            <div className="size-28 neu-card rounded-[2.5rem] flex items-center justify-center p-4 border-2 border-[#62AAE5]/20">
              <h1 className="text-4xl font-black italic text-white tracking-tighter">V</h1>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black text-white tracking-tighter">Bienvenido</h2>
              <p className="text-[#62AAE5] text-xs font-bold uppercase tracking-[0.2em] mt-2">
                Modo {role === "driver" ? "Chofer" : "Pasajero"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-16 neu-card rounded-2xl flex items-center justify-center gap-4 active:scale-95 transition-all hover:border-[#62AAE5]/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-[#62AAE5]" /> : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-white font-bold">Continuar con Google</span>
                </>
              )}
            </button>

            <button 
              onClick={() => setView("register")}
              className="w-full h-16 neu-card rounded-2xl flex items-center justify-center gap-4 active:scale-95 transition-all hover:border-[#62AAE5]/30"
            >
              <MailIcon className="text-[#62AAE5]" />
              <span className="text-white font-bold">Continuar con Email</span>
            </button>
          </div>
          {error && <p className="text-red-400 text-[10px] text-center font-bold uppercase">{error}</p>}
        </div>
      )}

      {view === "register" && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-black text-white tracking-tight px-1">Crear Cuenta</h2>
          <div className="neu-card rounded-[32px] p-6 space-y-8 border border-white/5">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">¿Cuál es tu email?</p>
                  <div className="neu-inset rounded-2xl flex items-center px-4 h-16">
                    <MailIcon size={20} className="text-white/20 mr-3" />
                    <input 
                      type="email" 
                      placeholder="ejemplo@gmail.com" 
                      className="bg-transparent border-none focus:ring-0 w-full text-white font-bold outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full h-16 bg-[#62AAE5] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                  Siguiente
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">¿Cómo te llamas?</p>
                  <div className="neu-inset rounded-2xl flex items-center px-4 h-16">
                    <User size={20} className="text-white/20 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Nombre" 
                      className="bg-transparent border-none focus:ring-0 w-full text-white font-bold outline-none"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="neu-inset rounded-2xl flex items-center px-4 h-16">
                    <User size={20} className="text-white/20 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Apellido" 
                      className="bg-transparent border-none focus:ring-0 w-full text-white font-bold outline-none"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <button onClick={() => setStep(3)} className="w-full h-16 bg-[#62AAE5] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                  Siguiente
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">¿Cuándo naciste?</p>
                  <div className="neu-inset rounded-2xl flex items-center px-4 h-16">
                    <Calendar size={20} className="text-white/20 mr-3" />
                    <input 
                      type="date" 
                      className="bg-transparent border-none focus:ring-0 w-full text-white font-bold [color-scheme:dark] outline-none"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    />
                  </div>
                </div>
                <button onClick={() => setStep(4)} className="w-full h-16 bg-[#62AAE5] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">
                  Siguiente
                </button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">Crea una contraseña</p>
                  <div className="neu-inset rounded-2xl flex items-center px-4 h-16">
                    <Lock size={20} className="text-white/20 mr-3" />
                    <input 
                      type="password" 
                      placeholder="Mínimo 6 caracteres" 
                      className="bg-transparent border-none focus:ring-0 w-full text-white font-bold outline-none"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  onClick={finishRegistration} 
                  disabled={loading}
                  className="w-full h-16 bg-[#F59A2F] text-white font-black rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Entrar a VAMOS"}
                </button>
              </div>
            )}
          </div>
          {error && <p className="text-red-400 text-[10px] text-center font-bold uppercase">{error}</p>}
        </div>
      )}
    </div>
  );
}
