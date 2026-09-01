/**
 * The motion model behind the carousel and its expander.
 *
 * Values are the ones the reference exposes in its debug panel, kept as named
 * constants so they can be read against it rather than buried as magic numbers
 * inside an event handler.
 */

/** A drag past this commits to the next item even if it was slow. */
export const DISTANCE_COMMIT = 230.7;
/** …and a flick faster than this commits even if it was short. px/ms. */
export const VELOCITY_COMMIT = 0.1;

export type Spring = { value: number; velocity: number; target: number };

/** Stiffness and damping, as (k, c) with unit mass. */
export type SpringConfig = { k: number; c: number };

/** Open progress p. Firm, barely any overshoot — it carries a real image. */
export const OPEN_SPRING: SpringConfig = { k: 190, c: 25 };
/** The track. Looser, so a flick still reads as momentum. */
export const TRACK_SPRING: SpringConfig = { k: 120, c: 22 };

export const spring = (value = 0): Spring => ({ value, velocity: 0, target: value });

/**
 * Advances a spring by dt seconds.
 *
 * Sub-stepped at a fixed 1/240s: a stiff spring integrated against a long
 * frame diverges, and dropped frames are exactly when that happens. Returns
 * whether it is still moving, so the caller can stop its loop.
 */
export function step(s: Spring, dt: number, { k, c }: SpringConfig): boolean {
  const clamped = Math.min(dt, 0.05);
  const h = 1 / 240;
  let remaining = clamped;
  while (remaining > 0) {
    const t = Math.min(h, remaining);
    const a = -k * (s.value - s.target) - c * s.velocity;
    s.velocity += a * t;
    s.value += s.velocity * t;
    remaining -= t;
  }
  if (Math.abs(s.velocity) < 0.001 && Math.abs(s.value - s.target) < 0.0005) {
    s.value = s.target;
    s.velocity = 0;
    return false;
  }
  return true;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Fits an aspect inside a box without cropping it. */
export function contain(aspect: number, boxW: number, boxH: number) {
  const w = Math.min(boxW, boxH * aspect);
  return { width: w, height: w / aspect };
}
