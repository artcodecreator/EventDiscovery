import type { Metadata, Viewport } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { BootstrapClient } from "@/components/bootstrap-client";

export const metadata: Metadata = {
  title: "EventDiscovery Pakistan 🇵🇰 — Discover Local Community Events & Summits",
  description: "Discover, explore and RSVP for vibrant local community events, concerts, tech summits, sports and art exhibitions across Pakistan."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="d-flex flex-column min-vh-100 bg-light">
        <Providers>
          <BootstrapClient />
          <Navbar />
          <div className="flex-grow-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}