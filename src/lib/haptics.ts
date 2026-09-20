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
 *
 * That click is very quiet — it peaks around 0.02–0.05 — and the library has
 * no volume option, the level being set inside it. So in development the
 * audio output is fed through a gain stage, which turns the same sound up
 * without changing it.
 */
const DEV = process.env.NODE_ENV === "development";
/** Multiplier on the library's click; 4 is about +12 dB. */
const BOOST = 4;

type Boost = { gain: number; stages: Map<AudioContext, GainNode>; patched: boolean };
// On globalThis, not the module: a hot reload re-runs this file, and patching
// again stacked another gain stage on top each time.
const shared = globalThis as typeof globalThis & { __hapticBoost?: Boost };

/** Puts a gain node in front of every AudioContext's destination, so anything
 *  the library connects to it is louder. Development only. */
function boostAudio() {
  if (typeof BaseAudioContext === "undefined") return;
  const st = (shared.__hapticBoost ??= { gain: BOOST, stages: new Map(), patched: false });
  st.gain = BOOST;
  st.stages.forEach((node) => (node.gain.value = BOOST));
  if (st.patched) return;
  st.patched = true;

  const desc = Object.getOwnPropertyDescriptor(BaseAudioContext.prototype, "destination");
  if (!desc?.get) return;
  Object.defineProperty(BaseAudioContext.prototype, "destination", {
    ...desc,
    get(this: BaseAudioContext) {
      const real = desc.get!.call(this) as AudioDestinationNode;
      if (!(this instanceof AudioContext)) return real;
      let stage = st.stages.get(this);
      if (!stage) {
        stage = this.createGain();
        stage.gain.value = st.gain;
        stage.connect(real);
        st.stages.set(this, stage);
      }
      return stage;
    },
  });

  // Every useHaptics() call makes its own library instance and so its own
  // context, and one made before any click (the timeline's, on a hover) starts
  // suspended. Wake whatever is asleep on the next gesture.
  const unlock = () =>
    st.stages.forEach((_, ctx) => {
      if (ctx.state === "closed") st.stages.delete(ctx);
      else if (ctx.state === "suspended") void ctx.resume();
    });
  for (const type of ["pointerdown", "keydown", "touchend"]) {
    window.addEventListener(type, unlock, { capture: true });
  }
}
if (DEV) boostAudio();

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
