"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LegoReveal, type LegoFrameState } from "@/lib/lego/engine";

/**
 * The portrait, cycling through restyled versions of the same photo and
 * melting back to the real one along a cursor trail.
 *
 * Falls back to the plain photo when WebGL is unavailable or motion is
 * reduced, and only runs while it is actually on screen.
 */
export default function PortraitReveal({ alt }: { alt: string }) {
  const host = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    const shell = card.current;
    if (!el || !shell) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const apply = (s: LegoFrameState) => {
      shell.style.setProperty("--tilt-x", `${-s.tiltX.toFixed(2)}deg`);
      shell.style.setProperty("--tilt-y", `${s.tiltY.toFixed(2)}deg`);
      shell.style.setProperty("--glow-x", `${(s.glowX * 100).toFixed(1)}%`);
      shell.style.setProperty("--glow-y", `${(s.glowY * 100).toFixed(1)}%`);
      shell.style.setProperty("--glow-i", s.glowI.toFixed(3));
      shell.style.setProperty("--glow-c", s.glowColor);
      shell.style.setProperty("--style-bg", s.bg);
    };

    const reveal = new LegoReveal(el, apply);
    if (!reveal.ok) {
      reveal.destroy();
      return;
    }
    setLive(true);

    // Only burn frames while the card is actually on screen.
    const io = new IntersectionObserver(
      ([e]) => reveal.setVisible(e.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);

    const onResize = () => reveal.resize();
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      reveal.destroy();
    };
  }, []);

  return (
    <span ref={card} className="portrait">
      <span className="portrait-glow" aria-hidden />
      <div ref={host} className="portrait-gl" aria-hidden={live} />
      {!live && (
        <Image
          src="/portrait.webp"
          alt={alt}
          fill
          sizes="176px"
          className="object-cover"
          priority
        />
      )}
      {live && <span className="sr-only">{alt}</span>}
    </span>
  );
}
