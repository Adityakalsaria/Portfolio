import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: "Aditya Kalsariya — Product Designer",
  description:
    "Product designer working across landing pages, marketing assets, product and UI. Currently designing at Copperx.",
  openGraph: {
    title: "Aditya Kalsariya — Product Designer",
    description:
      "Product designer working across landing pages, marketing assets, product and UI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&f[]=zodiak@401,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
