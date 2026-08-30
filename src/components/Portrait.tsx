"use client";

import { useRef } from "react";
import Image from "next/image";

/** How far the card leans at the edges. */
const MAX_DEG = 12;

/**
 * The portrait, tilting toward the cursor.
 *
 * Rotation is written to CSS custom properties and eased by a transition
 * rather than driven from a frame loop — the values only change on pointer
 * move, so a rAF loop would spend most of its time re-applying the same
 * transform.
 */
export default function Portrait({ alt }: { alt: string }) {
  const card = useRef<HTMLSpanElement>(null);

  const tilt = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el) return;
    // Hover-driven, so it never fires on touch; reduced motion opts out too.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * MAX_DEG * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * MAX_DEG * 2).toFixed(2)}deg`);
    el.style.setProperty("--lift", "1");
  };

  const rest = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0");
  };

  return (
    <span
      ref={card}
      className="portrait"
      onPointerMove={tilt}
      onPointerLeave={rest}
    >
      {/* Square source into a square tile, so object-cover crops nothing. */}
      <Image
        src="/portrait.webp"
        alt={alt}
        fill
        sizes="112px"
        className="object-cover"
        priority
      />
    </span>
  );
}
