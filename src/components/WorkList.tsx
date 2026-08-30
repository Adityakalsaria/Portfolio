"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, HAS_WORK, ALL_PROJECTS } from "@/lib/work";
import { aspectOf } from "@/lib/format";

/**
 * Work reads as a list first. The preview is the one indulgence: it appears
 * where the pointer already is, damped so it trails rather than snaps, and it
 * never appears on touch — there is no hover to justify it there.
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
      pos.x += (target.x - pos.x) * 0.11;
      pos.y += (target.y - pos.y) * 0.11;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(24px, -50%)`;
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
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className="mb-8 last:mb-0">
          <p className="group-label">{cat.name}</p>

          {cat.projects.length === 0 ? (
            <p className="text-[0.9375rem] text-dim">Awaiting export from Figma.</p>
          ) : (
            <div>
              {cat.projects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className="row"
                  onPointerEnter={() => setActive(p.slug)}
                  onPointerLeave={() =>
                    setActive((cur) => (cur === p.slug ? null : cur))
                  }
                  onFocus={() => setActive(p.slug)}
                  onBlur={() =>
                    setActive((cur) => (cur === p.slug ? null : cur))
                  }
                >
                  <span className="link truncate">{p.title}</span>
                  <span className="row-meta">View</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {HAS_WORK && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 hidden w-[15rem] overflow-hidden bg-surface md:block"
          style={{
            aspectRatio: activeProject ? aspectOf(activeProject) : "4 / 3",
            opacity: activeProject ? 1 : 0,
            transition: "opacity 0.4s var(--e-out)",
          }}
        >
          {activeProject && (
            <Image
              src={activeProject.cover}
              alt=""
              fill
              sizes="240px"
              className="object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}
