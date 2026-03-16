import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import FloatingSOSButton from "@/components/FloatingSOSButton";
import { AuthProvider } from "@/context/AuthContext";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VAMOS - Premium Carpooling",
  description: "La app de carpooling premium para rutas compartidas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${publicSans.variable} antialiased bg-[#040521] text-white flex justify-center min-h-screen`}>
        <AuthProvider>
          {/* Mobile Viewport Wrapper */}
          <div className="w-full max-w-[400px] min-h-screen bg-[#040521] relative flex flex-col shadow-2xl">
            <main className="flex-1 overflow-y-auto pb-32">
              {children}
            </main>
            
            {/* Global Components */}
            <BottomNavigationBar />
            <FloatingSOSButton />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
