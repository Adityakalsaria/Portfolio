"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EXPERIENCE,
  TIMELINE_FROM,
  TIMELINE_TO,
  monthsBetween,
  type Entry,
} from "@/lib/cv";

/** Must match .tl-label width in CSS. */
const LABEL_WIDTH = 260;

const MONTH_NAMES = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

function label(month: string) {
  const [y, m] = month.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

/**
 * A ruler of one tick per month. Moving across it scrubs the career; the tick
 * under the pointer is marked and the role covering that month is named above.
 *
 * Pointer position maps to a tick by ratio rather than by hit-testing each
 * tick, so the whole strip stays responsive with no per-tick listeners.
 */
export default function Timeline() {
  const months = useMemo(
    () => monthsBetween(TIMELINE_FROM, TIMELINE_TO),
    []
  );

  // Opens on the present, which is the entry most people are looking for.
  const [index, setIndex] = useState(months.length - 1);
  const ruler = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [labelX, setLabelX] = useState<number | null>(null);

  /**
   * Park the readout over the active tick. Measured from the tick element
   * itself rather than from the pointer, so it stays correct while the strip
   * is scrolled and on first paint before any pointer has moved.
   */
  const syncLabel = useCallback(() => {
    const tick = track.current?.children[index] as HTMLElement | undefined;
    const box = wrap.current?.getBoundingClientRect();
    if (!tick || !box) return;
    const t = tick.getBoundingClientRect();
    const x = t.left - box.left;
    // Keep the whole card on screen at both ends of the strip.
    setLabelX(Math.max(0, Math.min(box.width - LABEL_WIDTH, x)));
  }, [index]);

  useEffect(() => {
    syncLabel();
    window.addEventListener("resize", syncLabel);
    return () => window.removeEventListener("resize", syncLabel);
  }, [syncLabel]);

  /** All roles covering a month — two were held concurrently in 2020-21, so
   *  taking only the first would have hidden one of them entirely. */
  const rolesAt = (month: string): Entry[] =>
    EXPERIENCE.filter((e) => e.from && e.to && month >= e.from && month <= e.to);

  const month = months[index];
  const roles = rolesAt(month);
  const active = roles[0];

  const onMove = (e: React.PointerEvent) => {
    // Measured against the track, not the viewport window onto it — the
    // track's rect already shifts with scroll, so no scrollLeft maths.
    const box = track.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = (e.clientX - box.left) / box.width;
    const next = Math.round(ratio * (months.length - 1));
    setIndex(Math.max(0, Math.min(months.length - 1, next)));
  };

  return (
    <div className="tl">
      <div
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
          role="presentation"
        >
        <div ref={track} className="tl-track">
          {months.map((m, i) => {
            const inRole = roles.some(
              (r) => m >= (r.from ?? "") && m <= (r.to ?? "")
            );
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
              />
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
