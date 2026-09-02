"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SphereShot } from "@/lib/work";
import { useHaptics } from "@/lib/haptics";
import Expander, { type Rect } from "./Expander";
import {
  CHASE_SPRING,
  LEAN_SPRING,
  TRACK_SPRING,
  easeBlur,
  motionBlur,
  spring,
  step,
} from "@/lib/motion";

/** Cell pitch. The field is a lattice of these, extending in every direction.
 *  Scaled to the window so a big screen shows a denser wall rather than the
 *  same handful of pieces blown up. */
const CELL = 370;
const CELL_SM = 215;
/** Clear space kept around every piece, as a fraction of the cell. Two
 *  neighbours are always at least twice this apart. */
const PAD = 0.075;
/** Side of the square each piece is worth, within the padded box. Every piece
 *  gets this area whatever its proportions.
 *
 *  Sized so even a 3:1 banner fits the box without being capped — above
 *  about 0.6 the widest pieces were clipped to the box and lost area, which
 *  put a 1.5x spread back into a field meant to be even. */
const AREA = 0.6;
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
  /** Cursor lean, kept apart from the pan so a drag does not fight it. Eased
   *  rather than assigned: set straight from pointermove it stepped with the
   *  cursor, which is the opposite of a drift. */
  const leanX = useRef(spring(0));
  const leanY = useRef(spring(0));
  /** Which config the pan chases. Stiff while a wheel is driving it, loose
   *  after a throw, so momentum still reads as momentum. */
  const chase = useRef(TRACK_SPRING);
  /** Which lattice cell sits at the origin; a re-render is only needed when
   *  this changes. */
  const range = useRef({ c: 0, r: 0 });
  const cellRef = useRef(CELL);
  const blur = useRef(0);
  const haptic = useHaptics();

  const [box, setBox] = useState({ w: 0, h: 0, cell: CELL });
  const [, force] = useState(0);
  const [open, setOpen] = useState<{ shot: SphereShot; from: Rect; preview?: string } | null>(
    null
  );

  /**
   * Sizes the wall to whatever is left of the viewport, so the page has
   * nothing to scroll.
   *
   * The wall is a surface you drag, sitting in a document that could still
   * scroll — 212px of it, which a wheel over the wall would take in one go.
   * That is the jump: not the pan, which measures smooth, but the page
   * leaving under it. Nothing follows the wall, so it may as well end where
   * the viewport does.
   */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      // What sits under the wall, measured from the column rather than from
      // scrollHeight. scrollHeight is clamped to the viewport, so on a page
      // shorter than the window it reported the empty space below as content
      // and the wall could never grow into it — it settled 183px short and
      // stayed there, since the measurement agreed with itself.
      const col = el.closest(".doc");
      const below = col
        ? Math.max(0, col.getBoundingClientRect().bottom - rect.bottom)
        : 0;
      const fit = Math.max(320, window.innerHeight - rect.top - below);
      el.style.height = `${fit}px`;
      // The host already starts after the rail — see .wall in the CSS, which
      // mirrors railReserve so there is no first-frame shift. Running the
      // field beneath the index left it unreadable on artwork, and the paper
      // panel I put behind it read as a slab dropped on the work.
      const w = el.clientWidth;
      cellRef.current = w < 640 ? CELL_SM : Math.round(Math.min(CELL, el.clientHeight / 2.4));
      setBox({
        w,
        h: el.clientHeight,
        cell: w < 640 ? CELL_SM : Math.round(Math.min(CELL, el.clientHeight / 2.4)),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      el.style.height = "";
    };
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
      if (step(x.current, dt, chase.current)) moving = true;
      if (step(y.current, dt, chase.current)) moving = true;
      if (step(leanX.current, dt, LEAN_SPRING)) moving = true;
      if (step(leanY.current, dt, LEAN_SPRING)) moving = true;

      const speed = dt > 0 ? Math.hypot(x.current.value - px, y.current.value - py) / dt : 0;
      px = x.current.value;
      py = y.current.value;
      blur.current = easeBlur(blur.current, motionBlur(speed), dt);
      if (blur.current > 0) moving = true;

      const el = stage.current;
      if (el) {
        el.style.transform = `translate3d(${x.current.value + leanX.current.value}px,${
          y.current.value + leanY.current.value
        }px,0)`;
        const want = blur.current ? `blur(${blur.current.toFixed(2)}px)` : "";
        if (el.style.filter !== want) el.style.filter = want;
      }
      // Only when the pan has actually carried a new row or column into view.
      // Re-rendering every frame rebuilt thirty-five buttons for nothing and
      // handed the expander a new onClose each time.
      const cellNow = cellRef.current;
      const nc = Math.floor(-(x.current.value + leanX.current.value) / cellNow);
      const nr = Math.floor(-(y.current.value + leanY.current.value) / cellNow);
      if (nc !== range.current.c || nr !== range.current.r) {
        range.current = { c: nc, r: nr };
        force((n) => n + 1);
      }
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
    chase.current = TRACK_SPRING;
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
    leanX.current.target = (0.5 - e.clientX / box.w) * 2 * PARALLAX;
    leanY.current.target =
      (0.5 - (e.clientY - (host.current?.getBoundingClientRect().top ?? 0)) / box.h) *
      2 *
      PARALLAX;
    paint();
  };

  /**
   * Trackpad and wheel, panning the field the way a drag does.
   *
   * Registered by hand rather than as onWheel: React attaches wheel
   * listeners passively, and a passive listener cannot preventDefault.
   *
   * Vertical is only taken when the page has nowhere to scroll — which is the
   * case on a desktop, where the wall now fills the window. Where the page
   * can still scroll, a vertical gesture belongs to it and only the
   * horizontal component moves the wall.
   */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const pageScrolls =
        document.documentElement.scrollHeight > window.innerHeight + 1;
      const takeY = !pageScrolls;
      const dx = e.deltaX;
      const dy = takeY ? e.deltaY : 0;
      if (!dx && !dy) return;
      e.preventDefault();
      // Move the target and let the spring follow. Applying the delta to the
      // value directly tracked the device 1:1, and a trackpad delivers its
      // deltas in bursts, so the field advanced in steps.
      chase.current = CHASE_SPRING;
      x.current.target -= dx;
      y.current.target -= dy;
      paint();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paint]);

  const close = useCallback(() => setOpen(null), []);

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
  const ox = x.current.value + leanX.current.value;
  const oy = y.current.value + leanY.current.value;
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
          leanX.current.target = 0;
          leanY.current.target = 0;
          paint();
        }}
        role="group"
        aria-label={`${title}, ${shots.length} pieces`}
      >
        <div ref={stage} className="wall-stage">
          {cells.map(({ c, r, shot }) => {
            const aspect = shot.width / shot.height;
            // Constant area, not a random scale. Scaling each cell made a
            // landscape twice the size of a portrait beside it and the field
            // read as inconsistent rather than varied. Equal area gives every
            // piece the same visual weight while its shape stays its own.
            //
            // Fitted inside a padded box rather than the whole cell, so there
            // is always clear space around it, and the jitter is bounded by
            // whatever room is left — a piece can never cross into its
            // neighbour's.
            const box = cell * (1 - PAD * 2);
            const jr = (n: number) => hash(c + n, r + n * 7) - 0.5;
            const area = (box * AREA) ** 2;
            const raw = Math.sqrt(area * aspect);
            const fit = Math.min(1, box / raw, box / (raw / aspect));
            const w = raw * fit;
            return (
              <button
                key={`${c}:${r}`}
                type="button"
                className="wall-cell"
                // The cell tiles exactly; the jitter moves the picture inside
                // it. Offsetting the cell itself left uncovered strips between
                // them, and a click that landed in one hit the stage and did
                // nothing.
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
                  style={{
                    width: w,
                    aspectRatio: aspect,
                    transform: `translate(${jr(31) * (box - w)}px, ${
                      jr(57) * (box - w / aspect)
                    }px)`,
                  }}
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
          onClose={close}
        />
      )}
    </>
  );
}
