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
