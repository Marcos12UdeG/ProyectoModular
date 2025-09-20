import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { UserProvider } from "./context/UserContext";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#D7CCC8] via-[#A1887F] to-[#5D4037]`}
      >
        <UserProvider>
        {/* NAV */}
        <nav className="backdrop-blur-md bg-[#d7ccc880]/80 fixed top-0 w-full z-50 shadow-md">
          <div className="flex justify-between h-16 items-center px-6 max-w-6xl mx-auto">
            
            {/* Logo con degradado */}
            <div className="text-2xl font-extrabold bg-gradient-to-r from-[#4E342E] to-[#8D6E63] bg-clip-text text-transparent">
              STORYTELLER
            </div>

            {/* Links */}
            <ul className="flex space-x-8 text-[#3E2723] font-medium">
              {[
                { name: "Inicio", href: "/principal" },
                { name: "Cuentos", href: "/cuentos" },
                { name: "Ejercicios", href: "/ejercicios" },
                { name: "Grupos", href: "/grupos" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="relative hover:text-[#5D4037] transition duration-300 group"
                  >
                    {link.name}
                    {/* Animación subrayado */}
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#5D4037] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* CONTENIDO */}
        <main className="pt-20">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
