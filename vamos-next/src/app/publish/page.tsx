"use client";

import dynamic from "next/dynamic";

const PublishPageContent = dynamic(
  () => import("@/components/PublishPageContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#040521] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#62AAE5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#62AAE5] text-[10px] font-black uppercase tracking-widest italic animate-pulse">Cargando Editor...</p>
        </div>
      </div>
    )
  }
);

export default function PublishPage() {
  return <PublishPageContent />;
}
