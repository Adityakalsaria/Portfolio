"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { SphereShot } from "@/lib/work";

/**
 * Opens a grid tile the way focusing a sphere plane does: large, centred,
 * playing if it has a clip, with the link to its post when there is one.
 *
 * Every tile opens, not just the ones that link somewhere — a still that does
 * nothing on click reads as broken next to neighbours that respond.
 */
export default function Lightbox({
  shot,
  onClose,
}: {
  shot: SphereShot;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Stop the page scrolling behind the overlay, restoring exactly what was
    // there rather than assuming a default.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      {/* The backdrop closes; the frame swallows the click so controls work. */}
      <button className="lightbox-scrim" onClick={onClose} aria-label="Close" />

      <div
        className="lightbox-frame"
        style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
      >
        {shot.clip ? (
          <video
            className="lightbox-media"
            poster={shot.src}
            src={shot.clip}
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        ) : (
          <Image
            src={shot.src}
            alt=""
            fill
            sizes="(max-width: 60rem) 92vw, 1100px"
            className="object-contain"
            priority
          />
        )}
      </div>

      <div className="lightbox-bar">
        {shot.href ? (
          <a className="link" href={shot.href} target="_blank" rel="noreferrer">
            Watch this post on X ↗
          </a>
        ) : (
          <span className="sub">Press Escape to close</span>
        )}
        <button className="mode-btn is-on" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
