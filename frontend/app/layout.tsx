import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart City — El Jadida | Tableau de bord IoT",
  description:
    "Tableau de bord interactif Smart City pour El Jadida : capteurs IoT, énergie, eau, mobilité, qualité de l'air et données urbaines en temps réel.",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.className} h-full`}>
      <body className="h-full flex overflow-hidden bg-[#fafaf8] text-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-auto h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
