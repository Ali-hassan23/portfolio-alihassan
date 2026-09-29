import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "../public/scrollcraft/scrollcraft.css";
import "./globals.css";
import "./portfolio.css";
import { personal } from "@/content/site";
import { ScrollCraftMount } from "@/components/ScrollCraftMount";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${personal.name} · ${personal.role}`,
  description: personal.tagline,
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable}`}>
      <body>
        <span data-sc-progress />
        <div className="sc-grain" aria-hidden="true" />
        {children}
        <ScrollCraftMount />
      </body>
    </html>
  );
}
