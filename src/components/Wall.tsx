"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SphereShot } from "@/lib/work";
import { useHaptics } from "@/lib/haptics";
import Expander, { type Rect } from "./Expander";
import { TRACK_SPRING, easeBlur, motionBlur, spring, step } from "@/lib/motion";

/** Cell pitch. The field is a lattice of these, extending in every direction. */
const CELL = 300;
const CELL_SM = 190;
/** How far the field leans toward the cursor, in px. */
const PARALLAX = 44;

/** Positive modulo — JS % keeps the sign, which breaks indexing past zero. */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Deterministic 0–1 from a lattice coordinate. Stable while panning, and the
 *  same on the server and the client, which random would not be. */
function hash(col: number, row: number): number {
  const h = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

/**
 * An endless wall of work.
 *
 * A lattice rather than a list: which piece sits at a coordinate is derived
 * from the coordinate itself, so the field repeats outward forever in every
 * direction and there is nothing to reach the end of. Only the cells inside
 * the viewport are rendered, so "infinite" costs about thirty elements.
 *
 * Drag to move it, and it leans toward the cursor at rest. Replaces the
 * sphere: the same job — everything at once, one click in — without a WebGL
 * context.
 */
export default function Wall({
  shots,
  title,
}: {
  shots: SphereShot[];
  title: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const x = useRef(spring(0));
  const y = useRef(spring(0));
  /** Cursor lean, kept apart from the pan so a drag does not fight it. */
  const lean = useRef({ x: 0, y: 0 });
  const blur = useRef(0);
  const haptic = useHaptics();

  const [box, setBox] = useState({ w: 0, h: 0, cell: CELL });
  const [, force] = useState(0);
  const [open, setOpen] = useState<{ shot: SphereShot; from: Rect; preview?: string } | null>(
    null
  );

  useEffect(() => {
    const measure = () => {
      const el = host.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      setBox({ w, h, cell: w < 640 ? CELL_SM : CELL });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (host.current) ro.observe(host.current);
    return () => ro.disconnect();
  }, []);

  // ── the loop ────────────────────────────────────────────────────
  const running = useRef(false);
  const dragging = useRef(false);
  const paint = useCallback(() => {
    if (running.current) return;
    running.current = true;
    let last = performance.now();
    let px = x.current.value;
    let py = y.current.value;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let moving = dragging.current;
      if (step(x.current, dt, TRACK_SPRING)) moving = true;
      if (step(y.current, dt, TRACK_SPRING)) moving = true;

      const speed = dt > 0 ? Math.hypot(x.current.value - px, y.current.value - py) / dt : 0;
      px = x.current.value;
      py = y.current.value;
      blur.current = easeBlur(blur.current, motionBlur(speed), dt);
      if (blur.current > 0) moving = true;

      const el = stage.current;
      if (el) {
        el.style.transform = `translate3d(${x.current.value + lean.current.x}px,${
          y.current.value + lean.current.y
        }px,0)`;
        const want = blur.current ? `blur(${blur.current.toFixed(2)}px)` : "";
        if (el.style.filter !== want) el.style.filter = want;
      }
      // Re-render when the pan has carried a new row or column into view.
      force((n) => n + 1);
      if (moving) requestAnimationFrame(tick);
      else running.current = false;
    };
    requestAnimationFrame(tick);
  }, []);

  // ── drag ────────────────────────────────────────────────────────
  const drag = useRef({ id: -1, sx: 0, sy: 0, ox: 0, oy: 0, lx: 0, ly: 0, lt: 0, vx: 0, vy: 0, moved: 0 });
  const swallowClick = useRef(false);

  const onDown = (e: React.PointerEvent) => {
    if (open) return;
    swallowClick.current = false;
    const d = drag.current;
    d.id = e.pointerId;
    d.sx = d.lx = e.clientX;
    d.sy = d.ly = e.clientY;
    d.ox = x.current.value;
    d.oy = y.current.value;
    d.lt = performance.now();
    d.vx = d.vy = d.moved = 0;
    dragging.current = true;
    paint();

    const move = (ev: PointerEvent) => {
      if (!dragging.current || d.id !== ev.pointerId) return;
      const now = performance.now();
      const dt = Math.max(1, now - d.lt);
      d.vx = d.vx * 0.7 + ((ev.clientX - d.lx) / dt) * 0.3;
      d.vy = d.vy * 0.7 + ((ev.clientY - d.ly) / dt) * 0.3;
      d.lx = ev.clientX;
      d.ly = ev.clientY;
      d.lt = now;
      d.moved = Math.max(d.moved, Math.hypot(ev.clientX - d.sx, ev.clientY - d.sy));
      // The hand is authoritative: move the target with the value, or the
      // spring pulls back against the drag every frame.
      x.current.value = x.current.target = d.ox + (ev.clientX - d.sx);
      y.current.value = y.current.target = d.oy + (ev.clientY - d.sy);
      x.current.velocity = y.current.velocity = 0;
    };
    const up = (ev: PointerEvent) => {
      if (d.id !== ev.pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      dragging.current = false;
      d.id = -1;
      swallowClick.current = d.moved > 6;
      // Carry the throw. There is nothing to snap to on an endless field, so
      // the target is where the momentum would take it.
      x.current.velocity = d.vx * 1000;
      y.current.velocity = d.vy * 1000;
      x.current.target = x.current.value + d.vx * 260;
      y.current.target = y.current.value + d.vy * 260;
      paint();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onMove = (e: React.PointerEvent) => {
    if (dragging.current || e.pointerType !== "mouse" || !box.w) return;
    lean.current = {
      x: (0.5 - e.clientX / box.w) * 2 * PARALLAX,
      y: (0.5 - (e.clientY - (host.current?.getBoundingClientRect().top ?? 0)) / box.h) * 2 * PARALLAX,
    };
    paint();
  };

  const openAt = (shot: SphereShot, el: HTMLElement) => {
    if (swallowClick.current) {
      swallowClick.current = false;
      return;
    }
    const media = el.querySelector("img, video");
    const r = (media ?? el).getBoundingClientRect();
    haptic("nudge");
    setOpen({
      shot,
      preview: media instanceof HTMLImageElement ? media.currentSrc : undefined,
      from: { x: r.left, y: r.top, width: r.width, height: r.height },
    });
  };

  // ── which cells are on screen ───────────────────────────────────
  const cell = box.cell;
  const ox = x.current.value + lean.current.x;
  const oy = y.current.value + lean.current.y;
  const c0 = Math.floor(-ox / cell) - 1;
  const r0 = Math.floor(-oy / cell) - 1;
  const cols = box.w ? Math.ceil(box.w / cell) + 2 : 0;
  const rows = box.h ? Math.ceil(box.h / cell) + 2 : 0;

  const cells = [];
  for (let r = r0; r < r0 + rows; r++) {
    for (let c = c0; c < c0 + cols; c++) {
      // Coprime multipliers, so neighbours are never the same piece and the
      // repeat does not fall into visible rows or columns.
      const i = mod(c * 7 + r * 13, shots.length);
      cells.push({ c, r, shot: shots[i] });
    }
  }

  return (
    <>
      <div
        ref={host}
        className="wall"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerLeave={() => {
          lean.current = { x: 0, y: 0 };
          paint();
        }}
        role="group"
        aria-label={`${title}, ${shots.length} pieces`}
      >
        <div ref={stage} className="wall-stage">
          {cells.map(({ c, r, shot }) => {
            const s = 0.55 + hash(c, r) * 0.4;
            const aspect = shot.width / shot.height;
            const w = cell * s * (aspect > 1 ? 1 : aspect);
            return (
              <button
                key={`${c}:${r}`}
                type="button"
                className="wall-cell"
                style={{
                  left: c * cell,
                  top: r * cell,
                  width: cell,
                  height: cell,
                }}
                onClick={(e) => openAt(shot, e.currentTarget)}
                aria-label="Open image"
              >
                <span
                  className="wall-piece"
                  style={{ width: w, aspectRatio: aspect }}
                >
                  {shot.clip ? (
                    <video src={shot.clip} poster={shot.src} autoPlay loop muted playsInline />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={shot.src} alt="" loading="lazy" decoding="async" draggable={false} />
                  )}
                </span>
              </button>
            );
          })}
        </div>
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
