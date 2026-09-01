"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SphereShot } from "@/lib/work";
import { useHaptics } from "@/lib/haptics";
import Expander, { type Rect } from "./Expander";
import {
  DISTANCE_COMMIT,
  TRACK_SPRING,
  VELOCITY_COMMIT,
  spring,
  step,
} from "@/lib/motion";

/** Each item is fitted inside this box, so proportions vary but scale reads
 *  even — a portrait runs tall and narrow, a landscape short and wide.
 *
 *  Capped against the viewport as well: at 300px fixed, a phone showed one
 *  item and a sliver, which reads as a broken layout rather than a strip. */
const BOX_W = 300;
const BOX_H = 420;

function boxFor(vw: number, vh: number) {
  return { w: Math.min(BOX_W, vw * 0.68), h: Math.min(BOX_H, vh * 0.56) };
}

/**
 * A horizontal filmstrip you drag through, with the centred item openable in
 * place.
 *
 * Paging follows the reference's two commit thresholds: a slow drag past
 * DISTANCE_COMMIT advances, and so does a flick above VELOCITY_COMMIT however
 * short. Below both, the track springs back to where it was.
 */
export default function Carousel({
  shots,
  title,
}: {
  shots: SphereShot[];
  title: string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const centres = useRef<number[]>([]);
  const settled = useRef(false);
  const x = useRef(spring(0));
  const index = useRef(0);
  const haptic = useHaptics();

  const [open, setOpen] = useState<{ shot: SphereShot; from: Rect } | null>(null);
  const [active, setActive] = useState(0);
  const [box, setBox] = useState({ w: BOX_W, h: BOX_H });
  // Read inside the drag closure, which is created once per press.
  const boxRef = useRef(box);
  boxRef.current = box;

  /** Where the track must sit for item i to be centred. */
  const offsetFor = useCallback((i: number) => {
    const vp = viewport.current;
    if (!vp || !centres.current[i]) return 0;
    return vp.clientWidth / 2 - centres.current[i];
  }, []);

  // Two passes, because the second depends on the first: sizing the box
  // changes every item's width, so centres measured before it are stale —
  // which left the first item off-centre on a phone.
  const fitBox = useCallback(() => {
    const next = boxFor(window.innerWidth, window.innerHeight);
    setBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
  }, []);

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    centres.current = [...t.children].map((c) => {
      const el = c as HTMLElement;
      return el.offsetLeft + el.offsetWidth / 2;
    });
    const at = offsetFor(index.current);
    x.current.target = at;
    // First measurement: sit there, do not spring in from the left edge.
    if (!settled.current) {
      x.current.value = at;
      x.current.velocity = 0;
      settled.current = true;
    }
  }, [offsetFor]);

  // One loop drives the track. It runs only while the spring is live or a
  // drag is in flight, so a still carousel costs nothing.
  const running = useRef(false);
  const dragging = useRef(false);
  const paint = useCallback(() => {
    if (running.current) return;
    running.current = true;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const moving = dragging.current || step(x.current, dt, TRACK_SPRING);
      if (track.current) {
        track.current.style.transform = `translate3d(${x.current.value}px,0,0)`;
      }
      if (moving) requestAnimationFrame(tick);
      else running.current = false;
    };
    requestAnimationFrame(tick);
  }, []);

  // Measure after layout and start the loop, so the first item is centred on
  // arrival rather than sitting at the left edge until something is dragged.
  useEffect(() => {
    fitBox();
    const onResize = () => fitBox();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitBox]);

  // Re-measures once the new box has been laid out, never before.
  useEffect(() => {
    measure();
    paint();
  }, [measure, paint, shots, box]);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(shots.length - 1, i));
      if (next !== index.current) haptic("nudge");
      index.current = next;
      setActive(next);
      x.current.target = offsetFor(next);
      paint();
    },
    [shots.length, offsetFor, paint, haptic]
  );

  // Pointer drag. Velocity is a short exponential average, in px/ms, so a
  // flick is judged on how it ended rather than on its whole path.
  const drag = useRef({ id: -1, startX: 0, startOffset: 0, lastX: 0, lastT: 0, v: 0, moved: 0 });

  // Tracked on window rather than through setPointerCapture: capturing on the
  // viewport redirects the pointerup, and the item's click never fires — a tap
  // would start a drag and then do nothing.
  const onDown = (e: React.PointerEvent) => {
    if (open) return;
    const d = drag.current;
    d.id = e.pointerId;
    d.startX = d.lastX = e.clientX;
    d.startOffset = x.current.value;
    d.lastT = performance.now();
    d.v = 0;
    d.moved = 0;
    dragging.current = true;
    x.current.velocity = 0;
    paint();

    const move = (ev: PointerEvent) => {
      if (!dragging.current || d.id !== ev.pointerId) return;
      const now = performance.now();
      const dx = ev.clientX - d.lastX;
      const dt = Math.max(1, now - d.lastT);
      d.v = d.v * 0.7 + (dx / dt) * 0.3;
      d.lastX = ev.clientX;
      d.lastT = now;
      d.moved = Math.max(d.moved, Math.abs(ev.clientX - d.startX));

      const raw = d.startOffset + (ev.clientX - d.startX);
      // Rubber band past either end rather than a hard stop.
      const min = offsetFor(shots.length - 1);
      const max = offsetFor(0);
      const over = raw > max ? raw - max : raw < min ? raw - min : 0;
      x.current.value = raw - over + over * 0.35;
    };

    const up = (ev: PointerEvent) => {
      if (d.id !== ev.pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      dragging.current = false;
      d.id = -1;

      const travelled = d.lastX - d.startX;
      const committed =
        Math.abs(travelled) > DISTANCE_COMMIT || Math.abs(d.v) > VELOCITY_COMMIT;
      if (committed) {
        // A flick can cross more than one item; distance decides how many.
        const steps = Math.max(1, Math.round(Math.abs(travelled) / (boxRef.current.w * 0.9)));
        goTo(index.current - Math.sign(travelled) * steps);
      } else {
        goTo(index.current);
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const openAt = (shot: SphereShot, el: HTMLElement) => {
    // Below the tap threshold a pointerup is a tap, not the end of a drag.
    if (drag.current.moved > 6) return;
    const r = el.getBoundingClientRect();
    haptic("nudge");
    setOpen({ shot, from: { x: r.left, y: r.top, width: r.width, height: r.height } });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) return;
      if (e.key === "ArrowRight") goTo(index.current + 1);
      if (e.key === "ArrowLeft") goTo(index.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, open]);

  return (
    <>
      <div
        ref={viewport}
        className="carousel"
        onPointerDown={onDown}
        role="group"
        aria-label={`${title}, ${shots.length} items`}
      >
        <div ref={track} className="carousel-track">
          {shots.map((s, i) => {
            const aspect = s.width / s.height;
            const w = Math.min(box.w, box.h * aspect);
            return (
              <button
                key={s.src}
                type="button"
                className="carousel-item"
                style={{ width: `${w}px`, height: `${w / aspect}px` }}
                aria-current={i === active}
                onClick={(e) => openAt(s, e.currentTarget)}
              >
                {s.clip ? (
                  <CarouselClip shot={s} playing={i === active} />
                ) : (
                  <Image
                    src={s.src}
                    alt={`${title}, ${i + 1} of ${shots.length}`}
                    fill
                    sizes="320px"
                    className="object-cover"
                    draggable={false}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {open && (
        <Expander shot={open.shot} from={open.from} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

/** Only the centred clip plays; the rest hold their poster. */
function CarouselClip({ shot, playing }: { shot: SphereShot; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) void v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={shot.src}
      src={shot.clip}
      preload="none"
      loop
      muted
      playsInline
    />
  );
}
