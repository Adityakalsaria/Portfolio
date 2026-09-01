"use client";

import { useEffect, useRef, useState } from "react";
import type { SphereShot } from "@/lib/work";
import {
  CLOSE_SPRING,
  OPEN_SPRING,
  contain,
  lerp,
  easeBlur,
  motionBlur,
  spring,
  step,
} from "@/lib/motion";

export type Rect = { x: number; y: number; width: number; height: number };

/**
 * Opens one item by growing it out of the rect it already occupies.
 *
 * There is no cross-fade between a thumbnail and a separate overlay — the
 * opened element is the same picture, springing from the tile's box to a
 * centred one. Geometry is interpolated directly (x, y, width, height) rather
 * than transformed, so the image never stretches on the way.
 */
export default function Expander({
  shot,
  from,
  preview,
  onClose,
}: {
  shot: SphereShot;
  from: Rect;
  /** The exact URL the tile already painted, so it is in the browser cache
   *  and can be shown while the full-size version is still in flight. */
  preview?: string;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const p = useRef(spring(0));
  const blurRef = useRef(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Target: the largest centred box the viewport allows, at the shot's own
    // proportions. Recomputed each frame so a resize mid-flight still lands.
    const target = (): Rect => {
      const box = contain(
        shot.width / shot.height,
        Math.min(window.innerWidth * 0.92, 1400),
        window.innerHeight * 0.84
      );
      return {
        x: (window.innerWidth - box.width) / 2,
        y: (window.innerHeight - box.height) / 2,
        width: box.width,
        height: box.height,
      };
    };

    p.current.target = 1;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const closing = p.current.target === 0;
      const moving = step(p.current, dt, closing ? CLOSE_SPRING : OPEN_SPRING);
      const t = p.current.value;
      const to = target();
      const el = frame.current;
      if (el) {
        el.style.transform = `translate3d(${lerp(from.x, to.x, t)}px, ${lerp(
          from.y,
          to.y,
          t
        )}px, 0)`;
        el.style.width = `${lerp(from.width, to.width, t)}px`;
        el.style.height = `${lerp(from.height, to.height, t)}px`;
        // p is 0..1, so its velocity scales by how far the item is actually
        // travelling — a tile crossing the screen smears, one already near
        // the centre barely does.
        const travel = Math.hypot(to.x - from.x, to.y - from.y);
        blurRef.current = easeBlur(
          blurRef.current,
          motionBlur(Math.abs(p.current.velocity) * travel),
          dt
        );
        const blur = blurRef.current;
        const want = blur ? `blur(${blur.toFixed(2)}px)` : "";
        if (el.style.filter !== want) el.style.filter = want;
      }
      // On the root, not the frame. The scrim is the frame's sibling, so it
      // never inherited --p from it and fell back to 1 — meaning the backdrop
      // was fully opaque from the first frame and never faded at all. With an
      // opaque paper scrim that turned every open and close into a blank
      // white screen with a picture crawling across it.
      root.current?.style.setProperty("--p", String(t));

      // Unmount once it is invisible rather than once the spring is formally
      // settled: the last stretch is hundredths of a pixel and was holding
      // the overlay up for another fifth of a second after it looked done.
      if (closing && t < 0.004) return onClose();
      if (moving || p.current.target === 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shot, from, onClose]);

  // Escape and the scrim both reverse the same spring rather than cutting.
  const close = () => {
    setClosing(true);
    p.current.target = 0;
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div ref={root} className="expander" role="dialog" aria-modal="true">
      <button className="expander-scrim" onClick={close} aria-label="Close" />
      {/* A still closes when clicked, like the scrim — an opened image that
          swallows a click reads as stuck. A clip does not: those clicks
          belong to its controls. */}
      <div
        ref={frame}
        className="expander-frame"
        onClick={shot.clip ? undefined : close}
        style={shot.clip ? undefined : { cursor: "zoom-out" }}
      >
        {shot.clip ? (
          <video
            ref={(el) => {
              video.current = el;
              if (!el) return;
              // Opening is a click, so sound is allowed; fall back to muted
              // only if the browser still refuses to start.
              el.muted = false;
              el.play().catch(() => {
                el.muted = true;
                void el.play().catch(() => {});
              });
            }}
            className="expander-media"
            poster={shot.src}
            src={shot.clip}
            loop
            playsInline
            controls
          />
        ) : (
          <>
            {/* Underneath, and already decoded: the tile's own image. Without
                it the frame opened empty and stayed that way for 80-150ms
                while the large version was fetched — the "slow" part of
                opening was never the animation. */}
            {preview && (
              <img className="expander-media expander-preview" src={preview} alt="" />
            )}
            {/* A plain img on the original file — see expandedUrl. Going
                through next/image here bought a smaller payload at the cost
                of a transcode the reader waits on. */}
            <img className="expander-media" src={shot.src} alt="" decoding="async" />
          </>
        )}
      </div>
      {!closing && shot.href && (
        <a
          className="expander-link"
          href={shot.href}
          target="_blank"
          rel="noreferrer"
        >
          Watch this post on X ↗
        </a>
      )}
    </div>
  );
}
