"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single source of scroll truth: Lenis drives the page, GSAP's ticker drives
 * Lenis, and ScrollTrigger reads from Lenis. Running them off separate RAF
 * loops is what makes smooth-scroll sites feel a frame behind on pinning.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Triggers created during hydration measure against a page whose fonts and
    // images have not settled. Without this, a deep link can land past a
    // trigger that never fires and leaves its content stuck at opacity 0.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = setTimeout(refresh, 300);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor clicks bypass Lenis by default, which reads as a hard jump on a
    // page that smooth-scrolls everywhere else. Delegate them back through it.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;

      const target =
        href === "#top" ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -12 });
      history.replaceState(null, "", href);
    };

    document.addEventListener("click", onClick);

    /**
     * Lenis drives scrolling programmatically, which sails straight past
     * `overflow: hidden` — the only way to freeze the page is to stop Lenis
     * itself. A custom event keeps the instance private to this component
     * rather than hanging it off window.
     */
    const onLock = (e: Event) => {
      const locked = (e as CustomEvent<boolean>).detail;
      if (locked) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("scroll-lock", onLock);

    return () => {
      window.removeEventListener("scroll-lock", onLock);
      clearTimeout(settle);
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
