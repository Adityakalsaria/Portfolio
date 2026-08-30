"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const LINES = ["Aditya", "Kalsariya"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // One orchestrated load: name lines lead, everything else follows them in.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".hero-line",
          { yPercent: 108 },
          { yPercent: 0, duration: 1.4, stagger: 0.09 },
          0.45
        )
        .fromTo(
          ".hero-meta",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.07 },
          0.95
        )
        .fromTo(
          ".hero-rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.3, ease: "power3.inOut" },
          0.85
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col justify-between px-5 pb-8 pt-28 md:px-10 md:pb-10"
    >
      <div className="hero-meta flex items-center gap-2">
        <span className="dot-breathe h-1.5 w-1.5 rounded-full bg-ink" />
        <span className="u-label">Open to new work — 2026</span>
      </div>

      <div>
        <h1 className="u-display">
          {LINES.map((line) => (
            <span key={line} className="line-mask">
              <span className="line-inner hero-line">{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero-rule mt-8 h-px origin-left bg-line md:mt-12" />

        <div className="mt-6 grid gap-6 md:grid-cols-12 md:gap-8">
          <p className="hero-meta u-label md:col-span-3">Product Designer</p>
          <p className="hero-meta max-w-prose text-balance text-lg leading-snug text-muted md:col-span-5 md:text-xl">
            I design the surfaces where products get understood — landing pages,
            campaigns, product flows and the interface itself. Currently at{" "}
            <span className="text-ink">Copperx</span>.
          </p>
          <p className="hero-meta u-label md:col-span-4 md:justify-self-end">
            Scroll to see the work
          </p>
        </div>
      </div>
    </section>
  );
}
