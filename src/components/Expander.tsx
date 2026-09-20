"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hasMedium, thumb, type SphereShot } from "@/lib/work";
import {
  CLOSE_SPRING,
  LAYOUT_SPRING,
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
 * One still, in two layers: a small thumbnail underneath, which is already in
 * the cache and paints at once, and the real file above it, which fades in
 * when it has arrived. Remounted for each shot (see the key where it is used),
 * so stepping to another never leaves the last picture on screen, squeezed
 * into the new one's box, while the next one loads.
 *
 * Originals wider than 2000px also have a 1600px size, and the browser picks
 * between the two by the width the picture is actually drawn at, so a laptop
 * screen is not made to fetch the 3200px file.
 */
function Still({ shot, preview, width }: { shot: SphereShot; preview: string; width: number }) {
  const [loaded, setLoaded] = useState(false);
  const full = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // Already in the cache, so the load event went by before this ran.
    if (full.current?.complete && full.current.naturalWidth) setLoaded(true);
  }, []);
  const medium = hasMedium(shot);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="expander-media expander-preview" src={preview} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={full}
        className="expander-media expander-full"
        src={shot.src}
        srcSet={medium ? `${thumb(shot.src, 1600)} 1600w, ${shot.src} ${shot.width}w` : undefined}
        sizes={medium ? `${Math.round(width)}px` : undefined}
        alt=""
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </>
  );
}

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
  onStep,
}: {
  shot: SphereShot;
  from: Rect;
  /** The exact URL the tile already painted, so it is in the browser cache
   *  and can be shown while the full-size version is still in flight. */
  preview?: string;
  onClose: () => void;
  /** Left and right arrows, for stepping to a neighbouring item. The parent
   *  owns what "next" means — the wall goes by position, the grid by order. */
  onStep?: (dir: -1 | 1) => void;
}) {
  const stepRef = useRef(onStep);
  useEffect(() => {
    stepRef.current = onStep;
  });
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const p = useRef(spring(0));
  const blurRef = useRef(0);
  const opened = useRef(false);
  const [closing, setClosing] = useState(false);
  // Stepping to another shot: the frame glides from the box the last one had to
  // the box of the new one, instead of jumping.
  const seen = useRef(shot);
  const morph = useRef(spring(1));
  const prevTo = useRef<Rect | null>(null);
  const lastTo = useRef<Rect | null>(null);
  // A touch swipe that has just stepped, so the tap it ends with does not also close.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  // The width the picture is drawn at, in CSS px, for choosing between its sizes.
  const drawnWidth = useMemo(
    () =>
      contain(
        shot.width / shot.height,
        Math.min(window.innerWidth * 0.92, 1400),
        window.innerHeight * 0.84
      ).width,
    [shot]
  );

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

    // Only on the way in. This effect re-runs whenever the parent hands it a
    // new onClose — and the wall rebuilds that every frame while it animates
    // — so setting the target here unconditionally cancelled a close in
    // progress, over and over. It took four clicks to get one through.
    if (!opened.current) {
      opened.current = true;
      p.current.target = 1;
    }    if (seen.current !== shot) {
      seen.current = shot;
      prevTo.current = lastTo.current;
      morph.current = spring(0);
      morph.current.target = 1;
    }
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const closing = p.current.target === 0;
      const moving = step(p.current, dt, closing ? CLOSE_SPRING : OPEN_SPRING);
      const t = p.current.value;
      let to = target();
      if (prevTo.current && morph.current.value < 0.999) {
        step(morph.current, dt, LAYOUT_SPRING);
        const m = morph.current.value;
        const a = prevTo.current;
        to = {
          x: lerp(a.x, to.x, m),
          y: lerp(a.y, to.y, m),
          width: lerp(a.width, to.width, m),
          height: lerp(a.height, to.height, m),
        };
      }
      lastTo.current = to;
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
  /** For taps on the scrim and the picture: not the tap a swipe ends on. */
  const tapClose = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    close();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") stepRef.current?.(-1);
      else if (e.key === "ArrowRight") stepRef.current?.(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      ref={root}
      className="expander"
      role="dialog"
      aria-modal="true"
      // A horizontal swipe steps, like the arrow keys. Touch only: a mouse drag
      // is not a gesture here. The distance and the ratio keep a scroll or a
      // sloppy tap from counting.
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") return;
        swipe.current = { x: e.clientX, y: e.clientY };
        swiped.current = false;
      }}
      onPointerUp={(e) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          swiped.current = true;
          stepRef.current?.(dx < 0 ? 1 : -1);
        }
      }}
      onPointerCancel={() => {
        swipe.current = null;
      }}
    >
      <button className="expander-scrim" onClick={tapClose} aria-label="Close" />
      {/* A still closes when clicked, like the scrim — an opened image that
          swallows a click reads as stuck. A clip does not: those clicks
          belong to its controls. */}
      <div
        ref={frame}
        className="expander-frame"
        onClick={shot.clip ? undefined : tapClose}
        style={shot.clip ? undefined : { cursor: "zoom-out" }}
      >
        {shot.clip ? (
          <video
            key={shot.clip}
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
          <Still
            key={shot.src}
            shot={shot}
            preview={preview || thumb(shot.src, 960)}
            width={drawnWidth}
          />
        )}
        {/* Figma's selection chrome: the frame's edge, its corners, its name
            and its name.
            All of it in one overlay rather than as siblings of the media:
            loose, the handles resolved against different containing blocks
            and two of the four landed off the corner. */}
        <span className="sel" aria-hidden>
          <span className="sel-handle sel-tl" />
          <span className="sel-handle sel-tr" />
          <span className="sel-handle sel-bl" />
          <span className="sel-handle sel-br" />
          {shot.name && <span className="sel-name">{shot.name}</span>}
        </span>
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
      {onStep && (
        <div className="expander-nav">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              className="expander-nav-btn"
              aria-label={dir < 0 ? "Previous" : "Next"}
              onClick={() => !closing && onStep(dir)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d={dir < 0 ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
