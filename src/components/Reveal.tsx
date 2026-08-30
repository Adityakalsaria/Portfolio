"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: React.ReactNode;
  /** Stagger between direct children, in seconds. Keep the total under 0.5s. */
  stagger?: number;
  delay?: number;
  y?: number;
  className?: string;
};

/**
 * Scroll-triggered entrance for a block and its direct children. One shared
 * curve keeps every reveal on the page feeling like the same hand.
 */
export default function Reveal({
  children,
  stagger = 0.08,
  delay = 0,
  y = 28,
  className,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const targets = el.children.length > 1 ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          stagger,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, y]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
