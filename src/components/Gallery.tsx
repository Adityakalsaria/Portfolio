"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SphereShot } from "@/lib/work";
import { useHaptics } from "@/lib/haptics";
import Expander, { type Rect } from "./Expander";
import { gridLayout, stripLayout, type Layout } from "@/lib/layout";
import {
  DISTANCE_COMMIT,
  LAYOUT_SPRING,
  TRACK_SPRING,
  VELOCITY_COMMIT,
  rectSpring,
  retarget,
  spring,
  step,
  stepRect,
  type RectSpring,
} from "@/lib/motion";

const BOX_W = 300;
const BOX_H = 420;
const GAP = 20;

export type Mode = "strip" | "grid";

function boxFor(vw: number, vh: number) {
  return { w: Math.min(BOX_W, vw * 0.68), h: Math.min(BOX_H, vh * 0.56) };
}
const columnsFor = (vw: number) => (vw < 640 ? 2 : vw < 1024 ? 3 : 4);

/**
 * One set of items, two layouts, and the same springs carrying them between.
 *
 * Switching view does not swap one component for another — every item keeps
 * its identity and travels from where it is to where the new layout puts it.
 * Because the springs are retargeted rather than restarted, reversing halfway
 * carries the existing velocity into the reversal instead of stopping dead.
 */
export default function Gallery({
  shots,
  mode,
  title,
}: {
  shots: SphereShot[];
  mode: Mode;
  title: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLElement | null)[]>([]);
  const rects = useRef<RectSpring[]>([]);
  const layout = useRef<Layout | null>(null);
  const offset = useRef(spring(0));
  const height = useRef(spring(0));
  const index = useRef(0);
  const laidOut = useRef(false);
  const modeRef = useRef(mode);
  const haptic = useHaptics();

  const [open, setOpen] = useState<{ shot: SphereShot; from: Rect } | null>(null);
  const [width, setWidth] = useState(0);

  if (rects.current.length !== shots.length) {
    rects.current = shots.map(() => rectSpring());
  }

  /** Where the stage must sit for item i to be centred in the strip. */
  const offsetFor = useCallback(
    (i: number) => {
      const l = layout.current;
      const el = host.current;
      if (!l || !el || !l.boxes[i]) return 0;
      const b = l.boxes[i];
      return el.clientWidth / 2 - (b.x + b.width / 2);
    },
    []
  );

  // ── the loop ────────────────────────────────────────────────────
  const running = useRef(false);
  const dragging = useRef(false);
  const paint = useCallback(() => {
    if (running.current) return;
    running.current = true;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      let moving = dragging.current;
      for (let i = 0; i < rects.current.length; i++) {
        const r = rects.current[i];
        if (stepRect(r, dt, LAYOUT_SPRING)) moving = true;
        const el = cells.current[i];
        if (el) {
          el.style.transform = `translate3d(${r.x.value}px,${r.y.value}px,0)`;
          el.style.width = `${r.w.value}px`;
          el.style.height = `${r.h.value}px`;
        }
      }
      if (step(offset.current, dt, TRACK_SPRING)) moving = true;
      if (step(height.current, dt, LAYOUT_SPRING)) moving = true;

      if (stage.current) {
        stage.current.style.transform = `translate3d(${offset.current.value}px,0,0)`;
      }
      if (host.current) host.current.style.height = `${height.current.value}px`;

      if (moving) requestAnimationFrame(tick);
      else running.current = false;
    };
    requestAnimationFrame(tick);
  }, []);

  // ── layout ──────────────────────────────────────────────────────
  const relayout = useCallback(() => {
    const el = host.current;
    if (!el) return;
    // documentElement, not window: on a phone, a moment of horizontal overflow
    // makes the browser zoom out and innerWidth balloon — 390 read as 1560,
    // which picked the four-column desktop grid.
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    // Both layouts run full-bleed. The grid is capped and centred rather than
    // filling a 36rem column, where four columns came out at 129px.
    const l =
      modeRef.current === "strip"
        ? stripLayout(shots, boxFor(vw, vh), GAP)
        : gridLayout(
            shots,
            el.clientWidth,
            columnsFor(vw),
            GAP,
            Math.min(el.clientWidth - 32, 1180)
          );
    layout.current = l;

    const first = !laidOut.current;
    l.boxes.forEach((b, i) => retarget(rects.current[i], b, first));
    height.current.target = l.height;
    offset.current.target = modeRef.current === "strip" ? offsetFor(index.current) : 0;
    if (first) {
      height.current.value = l.height;
      offset.current.value = offset.current.target;
      laidOut.current = true;
    }
    paint();
  }, [shots, offsetFor, paint]);

  useEffect(() => {
    modeRef.current = mode;
    relayout();
  }, [mode, relayout]);

  useEffect(() => {
    const onResize = () => {
      setWidth(host.current?.clientWidth ?? 0);
      relayout();
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [relayout]);

  // ── dragging the strip ──────────────────────────────────────────
  const drag = useRef({ id: -1, startX: 0, startOffset: 0, lastX: 0, lastT: 0, v: 0, moved: 0 });
  // Set when a gesture turned out to be a drag, and consumed by the click it
  // produced. Reading drag.moved directly leaked: pointerdown is where it was
  // reset, and pointerdown returns early in grid mode, so one strip drag
  // suppressed every grid click that followed.
  const swallowClick = useRef(false);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(shots.length - 1, i));
      if (next !== index.current) haptic("nudge");
      index.current = next;
      offset.current.target = offsetFor(next);
      paint();
    },
    [shots.length, offsetFor, paint, haptic]
  );

  const onDown = (e: React.PointerEvent) => {
    // Cleared on every press, before the mode check. A drag that ended over
    // nothing clickable would otherwise leave the flag set, and swallow the
    // next real click whenever it came.
    swallowClick.current = false;
    if (mode !== "strip" || open) return;
    const d = drag.current;
    d.id = e.pointerId;
    d.startX = d.lastX = e.clientX;
    d.startOffset = offset.current.value;
    d.lastT = performance.now();
    d.v = 0;
    d.moved = 0;
    dragging.current = true;
    offset.current.velocity = 0;
    paint();

    const move = (ev: PointerEvent) => {
      if (!dragging.current || d.id !== ev.pointerId) return;
      const now = performance.now();
      const dt = Math.max(1, now - d.lastT);
      d.v = d.v * 0.7 + ((ev.clientX - d.lastX) / dt) * 0.3;
      d.lastX = ev.clientX;
      d.lastT = now;
      d.moved = Math.max(d.moved, Math.abs(ev.clientX - d.startX));

      const raw = d.startOffset + (ev.clientX - d.startX);
      const min = offsetFor(shots.length - 1);
      const max = offsetFor(0);
      const over = raw > max ? raw - max : raw < min ? raw - min : 0;
      offset.current.value = raw - over + over * 0.35;
    };
    const up = (ev: PointerEvent) => {
      if (d.id !== ev.pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      dragging.current = false;
      d.id = -1;
      swallowClick.current = d.moved > 6;
      const travelled = d.lastX - d.startX;
      if (Math.abs(travelled) > DISTANCE_COMMIT || Math.abs(d.v) > VELOCITY_COMMIT) {
        const box = boxFor(window.innerWidth, window.innerHeight);
        const steps = Math.max(1, Math.round(Math.abs(travelled) / (box.w * 0.9)));
        goTo(index.current - Math.sign(travelled) * steps);
      } else {
        goTo(index.current);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open || mode !== "strip") return;
      if (e.key === "ArrowRight") goTo(index.current + 1);
      if (e.key === "ArrowLeft") goTo(index.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, open, mode]);

  const openAt = (shot: SphereShot, el: HTMLElement) => {
    if (swallowClick.current) {
      swallowClick.current = false;
      return;
    }
    const r = el.getBoundingClientRect();
    haptic("nudge");
    setOpen({ shot, from: { x: r.left, y: r.top, width: r.width, height: r.height } });
  };

  return (
    <>
      <div
        ref={host}
        className={`gallery ${mode === "strip" ? "is-strip" : "is-grid"}`}
        onPointerDown={onDown}
        role="group"
        aria-label={`${title}, ${shots.length} items`}
      >
        <div ref={stage} className="gallery-stage">
          {shots.map((s, i) => (
            <button
              key={s.src}
              type="button"
              ref={(el) => {
                cells.current[i] = el;
              }}
              className="gallery-cell"
              onClick={(e) => openAt(s, e.currentTarget)}
              aria-label={s.clip ? "Play with sound" : "Open image"}
            >
              {s.clip ? (
                <GalleryClip shot={s} />
              ) : (
                <Image
                  src={s.src}
                  alt={`${title}, ${i + 1} of ${shots.length}`}
                  fill
                  sizes="(max-width: 40rem) 50vw, 340px"
                  className="object-cover"
                  draggable={false}
                />
              )}
              {s.clip && <span className="post-play" aria-hidden />}
            </button>
          ))}
        </div>
      </div>
      {open && (
        <Expander shot={open.shot} from={open.from} onClose={() => setOpen(null)} />
      )}
      <span hidden>{width}</span>
    </>
  );
}

/** Plays only while on screen — thirty-nine at once is not a page. */
function GalleryClip({ shot }: { shot: SphereShot }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        if (e.intersectionRatio > 0.3) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "300px", threshold: [0, 0.3] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={shot.src}
      src={near ? shot.clip : undefined}
      preload="none"
      loop
      muted
      playsInline
    />
  );
}
