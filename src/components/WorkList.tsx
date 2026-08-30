"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CATEGORIES, HAS_WORK, ALL_PROJECTS } from "@/lib/work";
import { metaOf } from "@/lib/format";
import RowTable, { type TableGroup } from "./RowTable";

/** How long each image holds before the next one pops in. */
const FRAME_MS = 460;

/**
 * Work reads as a list first. Hovering a row runs through that project's
 * images at the cursor — one at a time rather than a single fixed cover, so a
 * set of 21 shows what it actually contains. Never on touch, where there is
 * no hover to earn it.
 */
export default function WorkList() {
  const host = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = preview.current;
    const root = host.current;
    if (!el || !root) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let seeded = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // Without seeding, the first hover flies the preview in from 0,0.
      if (!seeded) {
        seeded = true;
        pos.x = target.x;
        pos.y = target.y;
      }
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(28px, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const activeProject = ALL_PROJECTS.find((p) => p.slug === active);
  const shots = activeProject?.shots;

  useEffect(() => {
    if (!active || !shots || shots.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(id);
  }, [active, shots]);

  const shot = shots?.length ? shots[frame % shots.length] : null;
  const src = shot?.src ?? activeProject?.cover;
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
    <div ref={host}>
      <RowTable
        label="Work"
        groups={groups}
        onActive={(key) => {
          // Restart the run from the first image. Done here rather than in an
          // effect on `active`: this is the event that changes it.
          setActive(key);
          setFrame(0);
        }}
      />

      {HAS_WORK && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 hidden w-[14rem] overflow-hidden bg-surface md:block"
          style={{
            aspectRatio: ratio,
            opacity: src ? 1 : 0,
            transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {src && (
            // Keyed on src so each image mounts fresh and replays the pop.
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="224px"
              className="preview-frame object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
