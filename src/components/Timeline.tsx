"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  EXPERIENCE,
  TIMELINE_FROM,
  TIMELINE_TO,
  monthsBetween,
  type Entry,
} from "@/lib/cv";

const MONTH_NAMES = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

/** "Sep 2025 — Now" for the role covering the hovered month. */
function span(role?: Entry) {
  if (!role?.from || !role.to) return null;
  const end = role.to === TIMELINE_TO ? "Now" : label(role.to);
  return `${label(role.from)} — ${end}`;
}

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

  const roleAt = (month: string): Entry | undefined =>
    EXPERIENCE.find((e) => e.from && e.to && month >= e.from && month <= e.to);

  const month = months[index];
  const active = roleAt(month);

  const onMove = (e: React.PointerEvent) => {
    const box = ruler.current?.getBoundingClientRect();
    if (!box) return;
    const ratio = (e.clientX - box.left) / box.width;
    const next = Math.round(ratio * (months.length - 1));
    setIndex(Math.max(0, Math.min(months.length - 1, next)));
  };

  return (
    <div className="tl">
      <div className="tl-label">
        <div className="tl-avatars">
          <span className="tl-avatar tl-avatar-me">
            <Image
              src="/portrait.jpg"
              alt=""
              fill
              sizes="44px"
              className="object-cover"
              style={{ objectPosition: "50% 18%" }}
            />
          </span>
          {active?.logo && (
            <span className="tl-avatar tl-avatar-logo">
              {/* Marks are already sized and centred; plain img avoids the
                  optimiser rasterising an SVG. */}
              <img src={active.logo} alt="" />
            </span>
          )}
        </div>

        {/* With a confirmed employer the role becomes the caption and the
            company the headline; without one the role is all we can lead on. */}
        {active?.company && <p className="tl-role">{active.title}</p>}
        <p className="tl-title">{active?.company || active?.title || "—"}</p>
        <p className="tl-dates">{span(active) ?? label(month)}</p>
      </div>

      <div
        ref={ruler}
        className="tl-ruler"
        onPointerMove={onMove}
        role="presentation"
      >
        {months.map((m, i) => {
          const inRole =
            active && m >= (active.from ?? "") && m <= (active.to ?? "");
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
  );
}
