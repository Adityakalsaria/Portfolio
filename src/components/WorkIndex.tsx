"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/lib/work";
import Reveal from "./Reveal";

/**
 * The index is the signature of the site: work is read as a typographic list
 * first, and the image only arrives where the pointer already is. Tilt is
 * driven by pointer velocity, so the preview leans into the motion the way a
 * held object would.
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
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      const dx = target.x - pos.x;
      // 0.09 is deliberately heavier than the cursor's 0.16 — the preview
      // trails the dot, which is what sells the two as separate objects.
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

  const activeProject = CATEGORIES.flatMap((c) => c.projects).find(
    (p) => p.slug === active
  );

  return (
    <section
      ref={section}
      id="work"
      className="relative px-5 py-24 md:px-10 md:py-40"
    >
      <Reveal className="mb-16 flex items-baseline justify-between md:mb-24">
        <h2 className="u-label">Selected work</h2>
        <span className="u-label">
          {CATEGORIES.reduce((n, c) => n + c.projects.length, 0)} projects
        </span>
      </Reveal>

      <div className="flex flex-col gap-20 md:gap-32">
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <Reveal className="mb-6 md:mb-8" stagger={0.06}>
              <h3 className="font-display text-3xl italic tracking-tight md:text-5xl">
                {cat.name}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted md:text-base">
                {cat.note}
              </p>
            </Reveal>

            <ul className="border-t border-line">
              {cat.projects.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`#${p.slug}`}
                    data-cursor
                    onPointerEnter={() => setActive(p.slug)}
                    onPointerLeave={() =>
                      setActive((cur) => (cur === p.slug ? null : cur))
                    }
                    onFocus={() => setActive(p.slug)}
                    onBlur={() =>
                      setActive((cur) => (cur === p.slug ? null : cur))
                    }
                    className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-6 transition-colors duration-300 hover:border-dim md:py-8"
                  >
                    <span className="col-span-8 flex items-baseline gap-4 md:col-span-6">
                      <span
                        className="inline-block text-2xl transition-transform duration-500 ease-[var(--e-out)] group-hover:translate-x-2 md:text-4xl"
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                      >
                        {p.title}
                      </span>
                    </span>
                    <span className="col-span-4 hidden text-sm text-muted transition-colors duration-300 group-hover:text-text md:col-span-4 md:block">
                      {p.blurb}
                    </span>
                    <span className="col-span-4 justify-self-end text-sm text-dim md:col-span-2">
                      {p.year}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Cursor-anchored preview. Fixed so it is never clipped by a row. */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[260px] w-[340px] overflow-hidden rounded-md bg-surface md:block"
        style={{
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
          />
        )}
      </div>
    </section>
  );
}
