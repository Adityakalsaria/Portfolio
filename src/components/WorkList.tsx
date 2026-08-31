"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CATEGORIES, HAS_WORK, categoryShots, leadProject } from "@/lib/work";
import RowTable, { type TableGroup } from "./RowTable";

/** How long each image holds before the next fades up. */
const FRAME_MS = 280;
/** Matches the .work-preview width in CSS. */
const PREVIEW_W = 224;
/** Space between the table's edge and the preview. */
const GAP = 28;

type Spot = { top: number; left: number };

/**
 * Work is one row per category, not per project. A category opens on its most
 * recent piece and the rest are reachable from the rail there, which keeps
 * this list to four lines however much work sits behind it.
 *
 * Hovering a row runs through everything in that category beside it — parked
 * against the row rather than trailing the cursor, so the image holds still
 * long enough to read. Never on touch, where there is no hover to earn it.
 */
export default function WorkList() {
  const [active, setActive] = useState<string | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [frame, setFrame] = useState(0);
  const [placed, setPlaced] = useState(false);

  const onActive = useCallback((key: string | null, row?: HTMLElement) => {
    if (!key || !row) {
      setActive(null);
      return;
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // The row is display:contents, so it has no layout box of its own and
    // getBoundingClientRect() returns zeros. Measure its cells instead.
    const cells = [...row.children].map((c) => c.getBoundingClientRect());
    if (!cells.length) return;
    const top = Math.min(...cells.map((c) => c.top));
    const bottom = Math.max(...cells.map((c) => c.bottom));
    const rowLeft = Math.min(...cells.map((c) => c.left));
    const rowRight = Math.max(...cells.map((c) => c.right));

    // Sit to the right of the row; fall to its left if that would run off.
    const right = rowRight + GAP;
    const left =
      right + PREVIEW_W > window.innerWidth - 16
        ? Math.max(16, rowLeft - GAP - PREVIEW_W)
        : right;

    setSpot({ top: (top + bottom) / 2, left });
    setActive(key);
    setFrame(0);

    // The card sits at 0,0 until the first hover with its position transition
    // already live, so that first hover would glide it in from the top-left
    // corner. Two frames, because a single rAF runs before the next paint and
    // the browser would still interpolate from 0,0.
    if (!placed) {
      requestAnimationFrame(() => requestAnimationFrame(() => setPlaced(true)));
    }
  }, [placed]);

  const category = CATEGORIES.find((c) => c.id === active);
  const shots = category ? categoryShots(category) : [];

  useEffect(() => {
    if (!active || shots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [active, shots.length]);

  const step = shots.length ? frame % shots.length : 0;
  const shot = shots[step];
  const ratio = shot ? `${shot.width} / ${shot.height}` : "4 / 3";

  // One entry per category. Empty ones stay listed but unlinked, so the shape
  // of the work is visible before every category has something in it.
  const groups: TableGroup[] = [
    {
      name: "",
      items: CATEGORIES.map((c) => {
        const lead = leadProject(c);
        return {
          key: c.id,
          title: c.name,
          href: lead ? `/work/${lead.slug}` : undefined,
          quiet: !lead,
        };
      }),
    },
  ];

  return (
    <div>
      <RowTable label="Work" groups={groups} onActive={onActive} flat />

      {HAS_WORK && (
        <div
          aria-hidden
          className={placed ? "work-preview is-placed" : "work-preview"}
          style={{
            top: spot?.top ?? 0,
            left: spot?.left ?? 0,
            aspectRatio: ratio,
            opacity: shots.length && spot ? 1 : 0,
          }}
        >
          {/* Every frame stays mounted and the current one fades up. Swapping a
              single <img> made each step wait on its own fetch, so the first
              run through a category stalled on image one. */}
          {shots.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt=""
              fill
              sizes="224px"
              className="preview-frame object-cover"
              style={{ opacity: i === step ? 1 : 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
