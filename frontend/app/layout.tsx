import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Smart City — El Jadida | Tableau de bord IoT",
  description:
    "Tableau de bord interactif Smart City pour El Jadida : capteurs IoT, énergie, eau, mobilité, qualité de l'air et données urbaines en temps réel.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${roboto.className} h-full`}>
      <body className="min-h-full flex flex-col bg-[#fafaf8] text-gray-900">
        {children}
      </body>
    </html>
  );
}
