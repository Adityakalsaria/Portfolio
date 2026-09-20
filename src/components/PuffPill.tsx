"use client";

import { useEffect, useRef, useState } from "react";

/** How far the pill leans toward the pointer, and the most it may move, px. */
const STRENGTH = 0.1;
const MAX = 9;

/**
 * A pill label with three behaviours, after amo's hover button:
 *   - it leans toward the pointer while the pointer is over its cell,
 *   - it pops on press, on a spring that overshoots and settles,
 *   - on hover a short clip plays in its place, if one is given, and is reset
 *     on leave. The clip is the whole "puffy letters" effect: it is only a
 *     video, so any clip of the label inflating will do.
 *
 * Hover-only. Where there is no hover (touch) or motion is reduced, it is a
 * plain label, so a tap follows the row's link rather than starting a clip.
 * It is not a link itself: it sits inside a linked row, and nesting anchors
 * is invalid.
 */
export default function PuffPill({
  label,
  video,
}: {
  label: string;
  /** Path of the clip without an extension, expecting .webm and .mp4 beside it. */
  video?: string;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);
  const live = useRef(false);
  const fx = useRef({ tx: 0, ty: 0, x: 0, y: 0, pop: 0, pos: 0, vel: 0, raf: 0 });

  useEffect(() => {
    live.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrap.current;
    const box = el?.parentElement;
    if (!el || !box || !live.current) return;
    const s = fx.current;

    const tick = () => {
      s.x += (s.tx - s.x) * 0.2;
      s.y += (s.ty - s.y) * 0.2;
      s.pop *= 0.9;
      if (s.pop < 0.001) s.pop = 0;
      s.vel += (s.pop - s.pos) * 0.22;
      s.vel *= 0.68;
      s.pos += s.vel;
      el.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px) scale(${(1 + s.pos).toFixed(3)})`;
      const rest =
        Math.abs(s.tx - s.x) < 0.08 && Math.abs(s.ty - s.y) < 0.08 &&
        s.pop === 0 && Math.abs(s.pos) < 0.001 && Math.abs(s.vel) < 0.001 &&
        s.tx === 0 && s.ty === 0;
      if (rest) {
        el.style.transform = "";
        s.raf = 0;
      } else {
        s.raf = requestAnimationFrame(tick);
      }
    };
    const wake = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      s.tx = clamp((e.clientX - (r.left + r.width / 2)) * STRENGTH);
      s.ty = clamp((e.clientY - (r.top + r.height / 2)) * STRENGTH);
      wake();
    };
    const onLeave = () => {
      s.tx = s.ty = 0;
      wake();
    };
    const onDown = () => {
      s.pop = Math.min(s.pop + 0.06, 0.28);
      wake();
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    return () => {
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  const enter = () => {
    if (!live.current) return;
    setHover(true);
    const v = clip.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const leave = () => {
    setHover(false);
    const v = clip.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const showClip = hover && ready;

  return (
    <span
      ref={wrap}
      className="puff"
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <span className="pill pill-link" style={{ opacity: showClip ? 0 : 1 }}>
        {label}
      </span>
      {video && (
        <video
          ref={clip}
          aria-hidden
          className="puff-clip"
          muted
          playsInline
          preload="auto"
          loop
          style={{ opacity: showClip ? 1 : 0 }}
          onCanPlay={() => setReady(true)}
        >
          <source src={`${video}.webm`} type="video/webm" />
          <source src={`${video}.mp4`} type="video/mp4" />
        </video>
      )}
    </span>
  );
}
