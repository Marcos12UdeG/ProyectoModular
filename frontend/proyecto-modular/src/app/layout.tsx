import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Storyteller",
  description: "Aprende inglés de forma divertida con historias y lecciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#FFF8F0] via-[#FDE2D3] to-[#F8CBA6]`}
      >
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md shadow-md fixed top-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="text-xl font-extrabold text-[#8B3E2F]">
                STORYTELLER
              </div>

              {/* Links de navegación */}
              <ul className="flex space-x-6 text-[#8B3E2F] font-medium">
                <li>
                  <Link
                    href="/principal"
                    className="hover:text-[#A44C3B] transition-colors"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cuentos"
                    className="hover:text-[#A44C3B] transition-colors"
                  >
                    Ejemplo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="hover:text-[#A44C3B] transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Contenido principal con padding para no tapar por navbar */}
        <main className="pt-20 px-4">{children}</main>
      </body>
    </html>
  );
}
