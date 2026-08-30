"use client";

import { useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { HapticInput } from "web-haptics";

/**
 * Haptics, gated in one place.
 *
 * Two things are worth knowing before changing this.
 *
 * `isSupported` only checks that `navigator.vibrate` is a function. Desktop
 * Chrome reports true and then does nothing, because there is no motor — so
 * support alone is not a useful gate.
 *
 * The library's audible click is guarded by its own `debug` flag. It is a
 * development aid, not a fallback for motorless devices: without debug there
 * is nothing to hear anywhere, ever.
 *
 * So: in development, run everywhere with debug on, which makes the feedback
 * audible on a laptop while building. In production, restrict to coarse
 * pointers, where there is actually a motor to drive.
 */
const DEV = process.env.NODE_ENV === "development";

export function useHaptics() {
  const { trigger, isSupported } = useWebHaptics({ debug: DEV });

  return useCallback(
    (input: HapticInput) => {
      if (!isSupported) return;
      if (!DEV && !window.matchMedia?.("(pointer: coarse)").matches) return;
      trigger(input);
    },
    [trigger, isSupported]
  );
}
