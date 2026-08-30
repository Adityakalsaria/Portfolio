import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { PROFILE } from "@/lib/cv";

/** One face for the whole document; hierarchy comes from size and italics. */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description:
    "Self-taught designer working across visual design, 3D, motion, icons and art direction. Currently at KOSH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={newsreader.className}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
