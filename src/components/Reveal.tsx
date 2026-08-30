"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type Props = {
  children: React.ReactNode;
  /** Stagger between direct children, in seconds. Keep the total under 0.5s. */
  stagger?: number;
  delay?: number;
  y?: number;
  className?: string;
};

/**
 * Scroll-triggered entrance for a block and its direct children.
 *
 * IntersectionObserver rather than ScrollTrigger: entrance reveals only need
 * "is it on screen yet", and IO answers that on its first callback even for
 * elements already in view. ScrollTrigger measures against a layout that
 * Lenis, fonts and images are still settling, so a deep link could land past
 * a trigger that never fired and leave the content stuck at opacity 0.
 *
 * The hidden state is applied from JS, never from CSS, so the content stays
 * readable if this component never runs.
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

    const targets = el.children.length > 1 ? Array.from(el.children) : [el];
    gsap.set(targets, { y, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          stagger,
          ease: "expo.out",
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.set(targets, { clearProps: "transform,opacity" });
    };
  }, [stagger, delay, y]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
