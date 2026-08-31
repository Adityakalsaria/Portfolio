"use client";

import { useEffect, useRef, useState } from "react";
import { ImageSphere } from "@/lib/image-sphere";
import { useHaptics } from "@/lib/haptics";
import type { SphereShot } from "@/lib/work";

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
  shots: SphereShot[];
  title: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const haptic = useHaptics();
  const [openHref, setOpenHref] = useState<string | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // Wider field than the default so the whole cloud sits inside the frame
    // instead of the nearest planes running off the edges.
    const sphere = new ImageSphere(
      el,
      shots.map((s) => ({ url: s.src, href: s.href, clip: s.clip })),
      {
        distance: 620,
        fov: 32,
        // The focused plane centres in the canvas, not the window. Bring the
        // canvas to the middle of the viewport so the two coincide.
        onFocusChange: (focus) => {
          haptic(focus ? "nudge" : 30);
          setOpenHref(focus?.href ?? null);
          if (focus) el.scrollIntoView({ block: "center", behavior: "smooth" });
        },
      }
    );

    // Under reduced motion the planes still load and render, but nothing
    // auto-rotates — renderStill draws each texture as it arrives.
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!still) sphere.start();

    return () => sphere.destroy();
  }, [shots, haptic]);

  return (
    <figure className="sphere" aria-label={`${title}: ${shots.length} images`}>
      <div ref={host} className="sphere-host" />
      <figcaption className="sub sphere-hint">
        {openHref ? (
          // Offered rather than opening on the second click: that click
          // already means "put it back", and one gesture cannot mean both.
          <a className="link" href={openHref} target="_blank" rel="noreferrer">
            Watch this post on X ↗
          </a>
        ) : (
          "Drag to spin, click an image to bring it forward. Clips play in place."
        )}
      </figcaption>
    </figure>
  );
}
