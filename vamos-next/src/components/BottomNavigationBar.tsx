"use client";

import React from "react";
import { Search, Plus, Car, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavigationBar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Buscar", icon: Search, href: "/search" },
    { label: "Publicar", icon: Plus, href: "/publish", isSpecial: true },
    { label: "Mis Viajes", icon: Car, href: "/trips" },
    { label: "Mensajes", icon: MessageSquare, href: "/messages" },
    { label: "Perfil", icon: User, href: "/profile" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[400px] h-20 nav-blur rounded-[32px] border border-white/10 flex items-center justify-around px-2 shadow-2xl z-[100]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.isSpecial) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 -mt-12 group"
            >
              <div className="w-14 h-14 rounded-full bg-[#F59A2F] flex items-center justify-center shadow-[0_4px_15px_rgba(245,154,47,0.4)] border-4 border-[#040521] group-active:scale-95 transition-transform">
                <Icon size={32} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              isActive ? "text-[#62AAE5] scale-105" : "text-white/50 hover:text-white/80"
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigationBar;
