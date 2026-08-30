import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PROFILE } from "@/lib/cv";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: `${PROFILE.name}`,
  description:
    "Self-taught designer working across visual design, 3D, motion, icons and art direction. Currently at KOSH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
