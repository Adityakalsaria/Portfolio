"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, HAS_WORK, ALL_PROJECTS } from "@/lib/work";
import { aspectOf, formatOf } from "@/lib/format";

/**
 * Work is a table: category in the left gutter, project, format on the right.
 * The preview is the one flourish — it appears where the pointer already is,
 * damped so it trails, and never on touch, where there is no hover to earn it.
 */
export default function WorkList() {
  const host = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = preview.current;
    const root = host.current;
    if (!el || !root) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let seeded = false;
    let frame = 0;

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
      frame = requestAnimationFrame(tick);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const activeProject = ALL_PROJECTS.find((p) => p.slug === active);

  return (
    <div ref={host}>
      <div className="rows">
        {CATEGORIES.map((cat) =>
          cat.projects.length === 0 ? (
            <div key={cat.id} className="contents">
              <span className="row-group">{cat.name}</span>
              <span className="row-title sub">Awaiting export</span>
              <span className="row-meta" />
            </div>
          ) : (
            cat.projects.map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="row-link contents"
                onPointerEnter={() => setActive(p.slug)}
                onPointerLeave={() =>
                  setActive((cur) => (cur === p.slug ? null : cur))
                }
                onFocus={() => setActive(p.slug)}
                onBlur={() => setActive((cur) => (cur === p.slug ? null : cur))}
              >
                {/* The category is named once per group, as a heading would be. */}
                <span className="row-group">{i === 0 ? cat.name : ""}</span>
                <span className="row-title">
                  <span className="link">{p.title}</span>
                </span>
                <span className="row-meta">{formatOf(p)}</span>
              </Link>
            ))
          )
        )}
      </div>

      {HAS_WORK && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 hidden w-[14rem] overflow-hidden bg-surface md:block"
          style={{
            aspectRatio: activeProject ? aspectOf(activeProject) : "4 / 3",
            opacity: activeProject ? 1 : 0,
            transition: "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {activeProject && (
            <Image
              src={activeProject.cover}
              alt=""
              fill
              sizes="224px"
              className="object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
