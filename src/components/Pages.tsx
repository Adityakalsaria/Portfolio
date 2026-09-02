"use client";

import { useEffect, useRef, useState } from "react";
import type { SphereShot } from "@/lib/work";
import { useHaptics } from "@/lib/haptics";

/**
 * Landing pages: the tops outside, the whole page inside.
 *
 * Neither the wall nor the grid suits them. Both are built on equal area
 * across many varied pieces, and six tall pages came out as near-identical
 * dark rectangles repeating across thirty cells. A stack of whole pages was
 * worse — nothing to scan, just kilometres of scroll.
 *
 * So a card each, cropped to the hero, which is what tells one page from
 * another at a glance; and the whole thing on click.
 *
 * No caption under them. The reference labels each card with its company,
 * which earns its place because every card is a different one; here they
 * would all read the same thing six times. It belongs back the day this grid
 * spans more than one company.
 */
export default function Pages({
  shots,
  title,
}: {
  shots: SphereShot[];
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const haptic = useHaptics();

  return (
    <>
      <ul className="pgrid">
        {shots.map((s, i) => (
          <li key={s.src} className="pcell">
            <button
              type="button"
              className="pcard"
              onClick={() => {
                haptic("nudge");
                setOpen(i);
              }}
              aria-label={`${title}, page ${i + 1} — open in full`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" loading="lazy" decoding="async" draggable={false} />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <PageViewer shot={shots[open]} title={title} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

/**
 * The whole page, on a ground dark enough to let it sit apart from the site.
 *
 * The overlay scrolls, not a box inside it: a scroll within a scroll is the
 * thing that made the first version awkward to use.
 */
function PageViewer({
  shot,
  title,
  onClose,
}: {
  shot: SphereShot;
  title: string;
  onClose: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scroller.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      ref={scroller}
      className="pview"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={-1}
      // Lenis owns the document wheel; without this the viewer never scrolls.
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="pview-close" onClick={onClose}>
        Close
      </button>
      {/* Segments, stacked with nothing between them, so a page cut up to
          clear WebP's size ceiling reads as one continuous capture. */}
      <div className="pview-stack">
        {(shot.parts ?? [shot]).map((part, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={part.src}
            className="pview-page"
            src={part.src}
            alt={i === 0 ? title : ""}
            decoding="async"
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </div>
  );
}
