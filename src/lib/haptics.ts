"use client";

import { useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { HapticInput } from "web-haptics";

/**
 * Haptics, gated in one place.
 *
 * Two conditions, both necessary. `isSupported` covers the browser; the
 * coarse-pointer check covers the device, because this is a touch affordance
 * — on a desktop there is no motor to drive and the library can fall back to
 * an audible click, which is worse than no feedback at all.
 *
 * Fire these only on discrete state changes. A buzz on anything continuous
 * reads as a fault, not as feedback.
 */
export function useHaptics() {
  const { trigger, isSupported } = useWebHaptics();

  return useCallback(
    (input: HapticInput) => {
      if (!isSupported) return;
      if (!window.matchMedia?.("(pointer: coarse)").matches) return;
      trigger(input);
    },
    [trigger, isSupported]
  );
}
