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

      {/* Sized by the media itself, capped to the viewport — not poured into
          a fixed frame, which letterboxed anything that was not the frame's
          shape. `fill` needs a sized parent, so this passes real dimensions. */}
      <div className="lightbox-frame">
        {shot.clip ? (
          <video
            className="lightbox-media"
            poster={shot.src}
            src={shot.clip}
            width={shot.width}
            height={shot.height}
            autoPlay
            loop
            playsInline
            controls
            ref={(el) => {
              if (!el) return;
              // Sound by default; if the browser refuses to autoplay unmuted,
              // fall back to muted rather than not playing at all.
              el.muted = false;
              el.play().catch(() => {
                el.muted = true;
                void el.play().catch(() => {});
              });
            }}
          />
        ) : (
          <Image
            className="lightbox-media"
            src={shot.src}
            alt=""
            width={shot.width}
            height={shot.height}
            sizes="92vw"
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
