import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Jammy - Encontra os teus amigos",
  description: "Organiza encontros informais com amigos. Cria jams, participa em eventos e combina programas com a tua malta.",
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
