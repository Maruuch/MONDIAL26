import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GA4Script } from "@/components/analytics/GA4Script";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://football2026.com"),
  title: {
    template: "%s | Football 2026",
    default: "Football 2026 — Collection Fan-Made Coupe du Monde",
  },
  description:
    "48 nations. 4 designs exclusifs par équipe. La collection fan-made officieuse de la Coupe du Monde 2026. Qualité premium, livraison mondiale.",
  keywords: ["football 2026", "coupe du monde", "maillot fan-made", "collection équipe nationale", "supporter"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Football 2026",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-wc-bg text-wc-text">
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
