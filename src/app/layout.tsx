import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Haptics from "@/components/Haptics";
import { PROFILE } from "@/lib/cv";

/**
 * Saans (Displaay). These are TRIAL files and are deliberately not committed —
 * the repo is public, and redistributing them is not something the trial
 * covers. See README for how to restore them locally; a web licence is
 * required before this ships anywhere public.
 */
const saans = localFont({
  src: [
    { path: "../fonts/Saans-TRIAL-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Saans-TRIAL-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/Saans-TRIAL-Medium.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

/** Where a relative OG or twitter image resolves against.
 *
 *  Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the project's stable domain on
 *  every deploy, so previews and production both point at the live site rather
 *  than at the preview's own throwaway hostname. Set NEXT_PUBLIC_SITE_URL to
 *  override it once there is a custom domain. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${PROFILE.name}`,
  description:
    "Self-taught designer working across visual design, 3D, motion, icons and art direction. Currently at KOSH.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={saans.className}>
      <body>
        <SmoothScroll />
        <Haptics />
        {children}
      </body>
    </html>
  );
}
