import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GA4Script } from "@/components/analytics/GA4Script";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://football2026.com"),
  title: {
    template: "%s | Football 2026",
    default: "Football 2026 — Maillots & Accessoires Fan-Made",
  },
  description:
    "Découvrez notre collection de maillots et accessoires fan-made pour la Coupe du Monde 2026. Produits non officiels de qualité premium.",
  keywords: ["football 2026", "maillot coupe du monde", "fan-made", "t-shirt équipe nationale"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Football 2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <GA4Script measurementId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? ""} />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
