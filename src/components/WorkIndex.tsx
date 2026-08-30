"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, HAS_WORK, ALL_PROJECTS } from "@/lib/work";
import { formatOf, aspectOf } from "@/lib/format";
import Reveal from "./Reveal";

/**
 * The index is the signature of the site: work is read as a typographic list
 * first, and the image only arrives where the pointer already is. Tilt tracks
 * pointer velocity, so the preview leans into the motion like a held object.
 */
export default function WorkIndex() {
  const section = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = preview.current;
    const host = section.current;
    if (!el || !host) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let tilt = 0;
    let seeded = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      // Without seeding, the first hover flies the preview in from 0,0.
      if (!seeded) {
        pos.x = target.x;
        pos.y = target.y;
        seeded = true;
      }
    };

    const tick = () => {
      const dx = target.x - pos.x;
      // Heavier damping than the cursor dot's 0.16 — the preview trails it,
      // which is what sells the two as separate objects.
      pos.x += dx * 0.09;
      pos.y += (target.y - pos.y) * 0.09;
      tilt += (Math.max(-14, Math.min(14, dx * 0.35)) - tilt) * 0.1;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      frame = requestAnimationFrame(tick);
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const activeProject = ALL_PROJECTS.find((p) => p.slug === active);

  return (
    <section
      ref={section}
      id="work"
      className="relative px-5 py-24 md:px-10 md:py-40"
    >
      <Reveal className="mb-16 flex items-baseline justify-between md:mb-24">
        <h2 className="u-label">Selected work</h2>
        <span className="u-label">
          {HAS_WORK ? `${ALL_PROJECTS.length} projects` : "Import pending"}
        </span>
      </Reveal>

      <div className="flex flex-col gap-20 md:gap-32">
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <Reveal className="mb-6 md:mb-8" stagger={0.06}>
              <h3 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl">
                {cat.name}
              </h3>
              {cat.note && (
                <p className="mt-2 max-w-md text-sm text-muted md:text-base">
                  {cat.note}
                </p>
              )}
            </Reveal>

            {cat.projects.length === 0 ? (
              <p className="border-t border-line pt-6 text-sm text-dim">
                Awaiting export from Figma.
              </p>
            ) : (
              <ul className="border-t border-line">
                {cat.projects.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/work/${p.slug}`}
                      data-cursor
                      onPointerEnter={() => setActive(p.slug)}
                      onPointerLeave={() =>
                        setActive((cur) => (cur === p.slug ? null : cur))
                      }
                      onFocus={() => setActive(p.slug)}
                      onBlur={() =>
                        setActive((cur) => (cur === p.slug ? null : cur))
                      }
                      className="group flex items-center justify-between gap-4 border-b border-line py-5 transition-colors duration-300 hover:border-dim md:py-8"
                    >
                      <span className="flex min-w-0 items-center gap-4 md:gap-8">
                        {/* Touch has no hover, so the thumbnail comes inline. */}
                        <span
                          className="relative block w-16 shrink-0 overflow-hidden rounded-sm bg-surface md:hidden"
                          style={{ aspectRatio: aspectOf(p) }}
                        >
                          <Image
                            src={p.cover}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </span>
                        <span className="truncate text-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-4xl">
                          {p.title}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-dim transition-colors duration-300 group-hover:text-muted md:text-sm">
                        {formatOf(p)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Cursor-anchored preview. Fixed so no row can clip it. */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden w-[min(24vw,340px)] overflow-hidden rounded-md bg-surface md:block"
        style={{
          aspectRatio: activeProject ? aspectOf(activeProject) : "4 / 3",
          opacity: activeProject ? 1 : 0,
          transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {activeProject && (
          <Image
            src={activeProject.cover}
            alt=""
            fill
            sizes="340px"
            className="object-cover"
            priority
          />
        )}
      </div>
    </section>
  );
}
