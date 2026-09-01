"use client";

import { useEffect } from "react";
import { useHaptics } from "@/lib/haptics";

/**
 * A light tap on any link or button, delegated from the document.
 *
 * One listener rather than a handler on every control: taps are uniform, and
 * scattering them means a new link silently ships without feedback. Fires on
 * pointerdown so it lands at the moment of contact, the way a native tap
 * does, rather than after the click resolves.
 */
export default function Haptics() {
  const haptic = useHaptics();

  // The library builds its audio context and DOM label lazily, inside the
  // first trigger — and that trigger returns early before the label exists.
  // So the first tap was spent on setup and only the second was felt.
  //
  // Primed on the first press rather than on mount: navigator.vibrate before
  // any gesture is blocked by the browser and logged as an error, so priming
  // early bought nothing and left a console error on every page. Capture
  // phase, so this runs before the delegated handler below and that tap is
  // still felt.
  useEffect(() => {
    const prime = () => haptic(1);
    document.addEventListener("pointerdown", prime, { capture: true, once: true });
    return () => document.removeEventListener("pointerdown", prime, { capture: true });
  }, [haptic]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      // Primary button only; a modified click is opening a tab, not tapping.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const el = (e.target as HTMLElement)?.closest?.(
        "a[href], button:not([disabled])"
      );
      if (!el) return;
      haptic(20);
    };

    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [haptic]);

  return null;
}
