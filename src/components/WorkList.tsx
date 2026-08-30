"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CATEGORIES, HAS_WORK, ALL_PROJECTS } from "@/lib/work";
import { metaOf } from "@/lib/format";
import RowTable, { type TableGroup } from "./RowTable";

/** How long each image holds before the next fades up. */
const FRAME_MS = 900;
/** Matches the .work-preview width in CSS. */
const PREVIEW_W = 224;
/** Space between the table's edge and the preview. */
const GAP = 28;

type Spot = { top: number; left: number };

/**
 * Work reads as a list first. Hovering a row runs through that project's
 * images beside it — parked against the row rather than trailing the cursor,
 * so the image holds still long enough to be read. Never on touch, where
 * there is no hover to earn it.
 */
export default function WorkList() {
  const [active, setActive] = useState<string | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [frame, setFrame] = useState(0);

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
  }, []);

  const activeProject = ALL_PROJECTS.find((p) => p.slug === active);
  const shots = activeProject?.shots;

  useEffect(() => {
    if (!active || !shots || shots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [active, shots]);

  const frames = shots?.length
    ? shots.map((s) => s.src)
    : activeProject
      ? [activeProject.cover]
      : [];
  const step = frames.length ? frame % frames.length : 0;
  const shot = shots?.length ? shots[step] : null;
  const ratio = shot
    ? `${shot.width} / ${shot.height}`
    : activeProject?.width && activeProject.height
      ? `${activeProject.width} / ${activeProject.height}`
      : "4 / 3";

  const groups: TableGroup[] = CATEGORIES.map((cat) => ({
    name: cat.name,
    items: cat.projects.length
      ? cat.projects.map((p) => ({
          key: p.slug,
          title: p.title,
          meta: metaOf(p),
          href: `/work/${p.slug}`,
        }))
      : [{ key: cat.id, title: "Awaiting export", quiet: true }],
  }));

  return (
    <div>
      <RowTable label="Work" groups={groups} onActive={onActive} />

      {HAS_WORK && (
        <div
          aria-hidden
          className="work-preview"
          style={{
            top: spot?.top ?? 0,
            left: spot?.left ?? 0,
            aspectRatio: ratio,
            opacity: frames.length && spot ? 1 : 0,
          }}
        >
          {/* Every frame stays mounted and the current one fades up. Swapping a
              single <img> made each step wait on its own fetch, so the first
              run through a project stalled on image one. */}
          {frames.map((f, i) => (
            <Image
              key={f}
              src={f}
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
