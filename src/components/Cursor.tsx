"use client";

import { useEffect, useRef } from "react";

/**
 * A damped dot that swells over anything marked data-cursor. Pointer position
 * is written straight to a ref and interpolated in RAF — putting it in React
 * state would re-render the tree on every mousemove.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = dot.current;
    if (!el) return;

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let scale = 1;
    let scaleTarget = 1;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const hit = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      scaleTarget = hit ? 3.4 : 1;
    };

    const tick = () => {
      // 0.16 lag reads as "attached with a little weight" rather than elastic
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      scale += (scaleTarget - scale) * 0.14;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3 w-3 rounded-full bg-text mix-blend-difference md:block"
    />
  );
}
