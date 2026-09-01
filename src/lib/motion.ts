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
/** Closing is shorter than opening. Nobody wants to watch the thing they
 *  just dismissed travel home; the return should be over before it is
 *  noticed. Critically damped, so it does not undershoot past the tile. */
export const CLOSE_SPRING: SpringConfig = { k: 340, c: 37 };
/** The track. Looser, so a flick still reads as momentum. */
export const TRACK_SPRING: SpringConfig = { k: 120, c: 22 };
/** Items travelling between layouts. Slightly softer than the opener, since
 *  they move much further and a stiff one snaps. */
export const LAYOUT_SPRING: SpringConfig = { k: 140, c: 23 };
/** Hover. Deliberately underdamped — c below 2·sqrt(k) is what overshoots,
 *  and the overshoot is the bounce. At k=260 critical would be ~32. */
export const HOVER_SPRING: SpringConfig = { k: 260, c: 19 };
/**
 * The rects while a hover is live.
 *
 * A bouncy hover spring is not enough on its own: it only moves the layout's
 * target, and LAYOUT_SPRING is near-critical (c 23 against a critical ~24),
 * so it chased the overshoot and flattened it. The rects need to be springy
 * too for the bounce to survive. ζ ≈ 0.57 here against a critical c of ~30.
 */
export const HOVER_LAYOUT_SPRING: SpringConfig = { k: 220, c: 17 };

export const spring = (value = 0): Spring => ({ value, velocity: 0, target: value });

/** A rect as four springs, so each edge can be retargeted independently. */
export type RectSpring = { x: Spring; y: Spring; w: Spring; h: Spring };

export const rectSpring = (): RectSpring => ({
  x: spring(),
  y: spring(),
  w: spring(),
  h: spring(),
});

/**
 * Points a rect's springs at a new destination.
 *
 * The velocities are left alone on purpose. Retargeting mid-flight is the
 * whole point — an item already moving toward the grid that is sent back to
 * the strip carries its speed into the reversal instead of stopping dead and
 * restarting, which is what makes an interrupted transition feel continuous.
 * `settle` is for the first layout, where there is nothing to preserve.
 */
export function retarget(
  r: RectSpring,
  to: { x: number; y: number; width: number; height: number },
  settle = false
) {
  r.x.target = to.x;
  r.y.target = to.y;
  r.w.target = to.width;
  r.h.target = to.height;
  if (settle) {
    for (const s of [r.x, r.y, r.w, r.h]) {
      s.value = s.target;
      s.velocity = 0;
    }
  }
}

/** Advances all four and reports whether any is still moving. */
export function stepRect(r: RectSpring, dt: number, cfg: SpringConfig): boolean {
  let moving = false;
  for (const s of [r.x, r.y, r.w, r.h]) if (step(s, dt, cfg)) moving = true;
  return moving;
}

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
