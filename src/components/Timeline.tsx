"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHaptics } from "@/lib/haptics";
import {
  EXPERIENCE,
  TIMELINE_FROM,
  TIMELINE_TO,
  monthsBetween,
  type Entry,
} from "@/lib/cv";

const MONTH_NAMES = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

/** Below this, ticks stop being separable and read as a grey smear. */
const MIN_PITCH = 9;

function label(month: string) {
  const [y, m] = month.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/**
 * A ruler of ticks across the career. Moving across it scrubs: the tick under
 * the pointer is marked, the months belonging to that role are tinted with the
 * employer's brand colour, and the readout above names it.
 *
 * Pointer position maps to a tick by ratio against the track's box rather than
 * by hit-testing each tick, so there are no per-tick listeners and touch drags
 * work through the same path as a mouse.
 */
export default function Timeline() {
  const months = useMemo(() => monthsBetween(TIMELINE_FROM, TIMELINE_TO), []);

  const ruler = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLDivElement>(null);

  // Sample every nth month when the strip is too narrow to draw them all.
  const [step, setStep] = useState(1);
  const ticks = useMemo(
    () => months.filter((_, i) => i % step === 0),
    [months, step]
  );

  const [index, setIndex] = useState(ticks.length - 1);
  const [labelX, setLabelX] = useState<number | null>(null);
  const haptic = useHaptics();
  const lastRole = useRef<string | null>(null);

  const rolesAt = (month: string): Entry[] =>
    EXPERIENCE.filter((e) => e.from && e.to && month >= e.from && month <= e.to);

  // Clamped at read time, so a resize that changes tick sampling cannot leave
  // the index out of range — no state write needed to correct it.
  const month = ticks[Math.min(index, ticks.length - 1)] ?? months[0];
  const roles = rolesAt(month);
  const active = roles[0];
  const brand = active?.color ?? "var(--ink)";

  const fit = useCallback(() => {
    const width = ruler.current?.clientWidth ?? 0;
    if (!width) return;
    const maxTicks = Math.max(8, Math.floor(width / MIN_PITCH));
    setStep(Math.max(1, Math.ceil(months.length / maxTicks)));
  }, [months.length]);

  /**
   * Park the readout over the active tick, measured from the tick element so
   * it stays right on first paint before any pointer has moved.
   *
   * The anchor slides along the card instead of being clamped: at the left of
   * the strip the card's left edge sits on the tick, at the right its right
   * edge does, and it eases between the two. A hard clamp pinned the card at
   * `width - cardWidth`, so it stopped following the pointer entirely across
   * the last stretch of the strip.
   */
  const syncLabel = useCallback(() => {
    const tick = track.current?.children[index] as HTMLElement | undefined;
    const box = wrap.current?.getBoundingClientRect();
    const w = labelEl.current?.offsetWidth ?? 0;
    if (!tick || !box || !box.width) return;
    const x = tick.getBoundingClientRect().left - box.left;
    const anchored = x - w * (x / box.width);
    setLabelX(Math.max(0, Math.min(box.width - w, anchored)));
  }, [index]);

  useEffect(() => {
    fit();
    const onResize = () => {
      fit();
      syncLabel();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fit, syncLabel]);

  useEffect(syncLabel, [syncLabel, step]);

  const onMove = (e: React.PointerEvent) => {
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = (e.clientX - box.left) / box.width;
    const next = Math.max(
      0,
      Math.min(ticks.length - 1, Math.round(ratio * (ticks.length - 1)))
    );
    setIndex(next);

    // One tap per role crossed, not per tick — 84 of those would be a buzz,
    // not a detent. Touch only; a mouse has nothing to feel it with.
    const role = rolesAt(ticks[next])[0]?.company ?? null;
    if (e.pointerType === "touch" && role !== lastRole.current) {
      if (lastRole.current !== null) haptic("nudge");
      lastRole.current = role;
    }
  };

  return (
    <div className="tl">
      <div
        ref={labelEl}
        className="tl-label"
        style={labelX === null ? undefined : { left: `${labelX}px` }}
      >
        {/* Height is held whether or not a mark exists, so scrubbing past a
            role without one does not jump the readout. */}
        <div className="tl-avatars">
          {roles.map(
            (r) =>
              r.logo && (
                <span key={r.title} className="tl-avatar tl-avatar-logo">
                  {/* Marks are already sized and centred; a plain img keeps
                      the optimiser from rasterising an SVG. */}
                  <img src={r.logo} alt="" />
                </span>
              )
          )}
        </div>

        <p className="tl-title">
          {roles.map((r) => r.company || r.title).join("  &  ") || "—"}
        </p>
        <p className="tl-dates">{active?.period ?? label(month)}</p>
      </div>

      <div className="tl-ruler-wrap" ref={wrap}>
        <div
          ref={ruler}
          className="tl-ruler"
          onPointerMove={onMove}
          onPointerDown={onMove}
          role="presentation"
        >
          <div ref={track} className="tl-track">
            {ticks.map((m, i) => {
              const inRole = roles.some(
                (r) => m >= (r.from ?? "") && m <= (r.to ?? "")
              );

              // The hovered month takes the brand colour outright; the rest of
              // that role's span takes a 20% tint of it, mixed toward the page
              // rather than made translucent so it stays a flat, even wash.
              const background =
                i === index
                  ? brand
                  : inRole
                    ? `color-mix(in srgb, ${brand} 20%, var(--paper))`
                    : undefined;

              return (
                <span
                  key={m}
                  className={
                    i === index
                      ? "tick tick-on"
                      : inRole
                        ? "tick tick-role"
                        : "tick"
                  }
                  style={background ? { background } : undefined}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
