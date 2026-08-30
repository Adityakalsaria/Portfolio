"use client";

import { useEffect, useRef } from "react";
import { ImageSphere } from "@/lib/image-sphere";
import type { Shot } from "@/lib/work";

/**
 * Mounts the three.js image sphere on a sized host.
 *
 * The engine appends its own absolutely positioned canvas, so the host must be
 * positioned and have a real height — it reads clientWidth/clientHeight at
 * construction.
 */
export default function ImageSphereView({
  shots,
  title,
}: {
  shots: Shot[];
  title: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // Wider field than the default so the whole cloud sits inside the frame
    // instead of the nearest planes running off the edges.
    const sphere = new ImageSphere(
      el,
      shots.map((s) => s.src),
      {
        distance: 620,
        fov: 32,
        // The focused plane centres in the canvas, not the window. Bring the
        // canvas to the middle of the viewport so the two coincide.
        onFocusChange: (focused) => {
          if (focused) el.scrollIntoView({ block: "center", behavior: "smooth" });
        },
      }
    );

    // Under reduced motion the planes still load and render, but nothing
    // auto-rotates — renderStill draws each texture as it arrives.
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!still) sphere.start();

    return () => sphere.destroy();
  }, [shots]);

  return (
    <figure className="sphere" aria-label={`${title}: ${shots.length} images`}>
      <div ref={host} className="sphere-host" />
      <figcaption className="sub sphere-hint">
        Drag to spin, click an image to bring it forward.
      </figcaption>
    </figure>
  );
}
