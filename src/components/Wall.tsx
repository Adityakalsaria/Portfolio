"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SphereShot } from "@/lib/work";
import { useHaptics } from "@/lib/haptics";
import Expander, { type Rect } from "./Expander";
import { OPEN_SPRING, spring, step } from "@/lib/motion";

/** How long a piece holds a slot before the next one takes it. */
const HOLD_MS = 4200;
/** Spread the swaps out so the wall is never still and never churns at once. */
const STAGGER_MS = 380;

type Slot = {
  /** Index into shots of what is showing, and what is arriving. */
  now: number;
  next: number | null;
  /** 0 while `now` holds the slot, 1 once `next` has fully replaced it. */
  p: ReturnType<typeof spring>;
};

function gridFor(vw: number, vh: number) {
  const cols = vw < 640 ? 2 : vw < 1024 ? 3 : vw < 1440 ? 4 : 5;
  const rows = vh < 700 ? 2 : 3;
  return { cols, rows };
}

/**
 * A wall of work that keeps turning over.
 *
 * Fixed cells, each holding one piece for a few seconds before the next takes
 * its place — so the whole set is seen without anyone scrolling, and the page
 * is never quite still. The swaps are staggered per cell rather than run in
 * lockstep, which is what stops it reading as a slideshow.
 *
 * Replaces the sphere: the same job (show everything at once, invite a click)
 * without a WebGL context, and openable by the same expander as every other
 * view.
 */
export default function Wall({
  shots,
  title,
}: {
  shots: SphereShot[];
  title: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLElement | null)[]>([]);
  const slots = useRef<Slot[]>([]);
  const cursor = useRef(0);
  const haptic = useHaptics();

  const [grid, setGrid] = useState(() => ({ cols: 5, rows: 3 }));
  const [, force] = useState(0);
  const [open, setOpen] = useState<{ shot: SphereShot; from: Rect; preview?: string } | null>(
    null
  );

  const count = grid.cols * grid.rows;

  // Seed one slot per cell, each starting on a different piece.
  if (slots.current.length !== count) {
    slots.current = Array.from({ length: count }, (_, i) => ({
      now: i % shots.length,
      next: null,
      p: spring(0),
    }));
    cursor.current = count % shots.length;
  }

  useEffect(() => {
    const onResize = () =>
      setGrid((prev) => {
        const next = gridFor(window.innerWidth, window.innerHeight);
        return prev.cols === next.cols && prev.rows === next.rows ? prev : next;
      });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── the swap loop ───────────────────────────────────────────────
  const running = useRef(false);
  const paint = useCallback(() => {
    if (running.current) return;
    running.current = true;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let moving = false;
      slots.current.forEach((s, i) => {
        if (s.next === null) return;
        if (step(s.p, dt, OPEN_SPRING)) moving = true;
        const el = cells.current[i];
        if (el) el.style.setProperty("--p", String(s.p.value));
        if (s.p.value > 0.995) {
          // Arrived: the incoming piece becomes the resident one.
          s.now = s.next;
          s.next = null;
          s.p.value = 0;
          s.p.target = 0;
          s.p.velocity = 0;
          if (el) el.style.setProperty("--p", "0");
          force((n) => n + 1);
        }
      });
      if (moving) requestAnimationFrame(tick);
      else running.current = false;
    };
    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (shots.length <= count) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const timers = slots.current.map((_, i) =>
      setInterval(
        () => {
          const s = slots.current[i];
          if (!s || s.next !== null || open) return;
          // Walk the pool rather than picking at random, so every piece gets
          // its turn instead of some never appearing.
          s.next = cursor.current;
          cursor.current = (cursor.current + 1) % shots.length;
          s.p.target = 1;
          paint();
          force((n) => n + 1);
        },
        HOLD_MS + i * STAGGER_MS
      )
    );
    return () => timers.forEach(clearInterval);
  }, [count, shots.length, paint, open]);

  const openAt = (shot: SphereShot, el: HTMLElement) => {
    const media = el.querySelector("img, video");
    const r = (media ?? el).getBoundingClientRect();
    haptic("nudge");
    setOpen({
      shot,
      preview: media instanceof HTMLImageElement ? media.currentSrc : undefined,
      from: { x: r.left, y: r.top, width: r.width, height: r.height },
    });
  };

  return (
    <>
      <div
        ref={host}
        className="wall"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
        role="group"
        aria-label={`${title}, ${shots.length} pieces`}
      >
        {slots.current.map((s, i) => {
          const cur = shots[s.now];
          const inc = s.next === null ? null : shots[s.next];
          return (
            <button
              key={i}
              type="button"
              ref={(el) => {
                cells.current[i] = el;
              }}
              className="wall-cell"
              onClick={(e) => openAt(cur, e.currentTarget)}
              aria-label="Open image"
            >
              <Piece shot={cur} role="out" scale={slotScale(i)} />
              {inc && <Piece shot={inc} role="in" scale={slotScale(i)} />}
            </button>
          );
        })}
      </div>
      {open && (
        <Expander
          shot={open.shot}
          from={open.from}
          preview={open.preview}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

/**
 * A stable per-slot size, so cells do not all fill edge to edge.
 *
 * Hashed from the slot index rather than random: the server and the client
 * have to agree on it, and a random value would differ between them and
 * throw a hydration mismatch. Between 0.62 and 1 — the reference sits its
 * pieces at around half their cell, and the unevenness plus the space it
 * leaves is most of what separates a wall of artefacts from a grid of tiles.
 */
function slotScale(i: number): number {
  const h = Math.sin(i * 12.9898) * 43758.5453;
  return 0.62 + (h - Math.floor(h)) * 0.38;
}

/**
 * One piece inside a cell.
 *
 * Sized by aspect rather than cropped, so a banner stays a banner and a
 * square stays square.
 */
function Piece({
  shot,
  role,
  scale,
}: {
  shot: SphereShot;
  role: "in" | "out";
  scale: number;
}) {
  const aspect = shot.width / shot.height;
  return (
    <span
      className={`wall-piece is-${role}`}
      style={{ aspectRatio: aspect, "--s": scale } as React.CSSProperties}
    >
      {shot.clip ? (
        <video src={shot.clip} poster={shot.src} autoPlay loop muted playsInline />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shot.src} alt="" loading="lazy" decoding="async" />
      )}
    </span>
  );
}
