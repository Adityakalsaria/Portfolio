"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * GhostReveal — a soft "ghostly" image reveal.
 *
 * A tall feathered alpha mask is laid over the element at
 * `mask-size: 100% <scale>%`, so the mask is several times taller than the box.
 * Animating `mask-position` slides that soft gradient across, and the content
 * bleeds in through a cloudy edge instead of a hard wipe.
 *
 * Direction picks which mask edge leads. Scroll-triggered by default via
 * IntersectionObserver; pass `play` to drive it yourself. Honors reduced motion.
 */

export type GhostDirection = "up" | "down" | "left" | "right";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia?.(MOTION_QUERY);
  mq?.addEventListener("change", cb);
  return () => mq?.removeEventListener("change", cb);
}

function getMotion() {
  return window.matchMedia?.(MOTION_QUERY).matches ?? false;
}

export interface GhostRevealProps {
  children: ReactNode;
  /** Feathered mask with a VERTICAL ramp, used for up/down. */
  maskSrc: string;
  /** HORIZONTAL-ramp mask for left/right, so the feather runs along the wipe. */
  maskSrcH?: string;
  /** How many times taller/wider than the box the mask is. Bigger = softer. */
  scale?: number;
  duration?: number;
  easing?: string;
  direction?: GhostDirection;
  /** Controlled trigger. Omit to reveal on scroll-into-view, once. */
  play?: boolean;
  threshold?: number;
  /** Fires once the mask has finished animating OUT, so a driver can swap the
   *  child while nothing is visible and never flash one image over another. */
  onHidden?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Each direction picks a mask image, which dimension is oversized, and the
 * from/to positions for hidden -> revealed. Up/down use the vertical ramp,
 * left/right the horizontal one — no element is rotated, since rotating a
 * non-square box clips it.
 */
function axisFor(
  dir: GhostDirection,
  maskSrc: string,
  maskSrcH: string,
  scale: number
) {
  const pct = `${scale}%`;
  switch (dir) {
    case "up":
      return { image: `url(${maskSrc})`, size: `100% ${pct}`, from: "0% 0%", to: "0% 100%" };
    case "down":
      return { image: `url(${maskSrc})`, size: `100% ${pct}`, from: "0% 100%", to: "0% 0%" };
    case "left":
      return { image: `url(${maskSrcH})`, size: `${pct} 100%`, from: "0% 0%", to: "100% 0%" };
    case "right":
      return { image: `url(${maskSrcH})`, size: `${pct} 100%`, from: "100% 0%", to: "0% 0%" };
  }
}

export function GhostReveal({
  children,
  maskSrc,
  maskSrcH,
  scale = 500,
  duration = 1000,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  direction = "up",
  play,
  threshold = 0.2,
  onHidden,
  className = "",
  style,
}: GhostRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controlled = play !== undefined;
  // Without IntersectionObserver there is nothing to wait for, so start shown
  // rather than setting state from inside the effect body.
  const [shown, setShown] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  // useSyncExternalStore keeps this correct across SSR without a state write
  // in an effect, and picks up a mid-session change to the OS setting.
  const reduce = useSyncExternalStore(subscribeMotion, getMotion, () => false);

  useEffect(() => {
    if (controlled) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [controlled, threshold]);

  const open = controlled ? play! : shown;
  const { image, size, from, to } = axisFor(
    direction,
    maskSrc,
    maskSrcH ?? maskSrc,
    scale
  );

  // Refs so the listener stays attached without rebinding every render.
  // Written in an effect rather than during render; transitionend fires long
  // after paint, so the handler never reads a stale value.
  const openRef = useRef(open);
  const onHiddenRef = useRef(onHidden);
  useEffect(() => {
    openRef.current = open;
    onHiddenRef.current = onHidden;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: TransitionEvent) => {
      if (e.target !== el) return;
      if (
        e.propertyName !== "mask-position" &&
        e.propertyName !== "-webkit-mask-position"
      )
        return;
      if (!openRef.current) onHiddenRef.current?.();
    };
    el.addEventListener("transitionend", handle);
    return () => el.removeEventListener("transitionend", handle);
  }, []);

  const maskStyle: CSSProperties = reduce
    ? { opacity: open ? 1 : 0, transition: `opacity 0.3s ${easing}` }
    : {
        WebkitMaskImage: image,
        maskImage: image,
        WebkitMaskSize: size,
        maskSize: size,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: open ? to : from,
        maskPosition: open ? to : from,
        transition: `-webkit-mask-position ${duration}ms ${easing}, mask-position ${duration}ms ${easing}`,
      };

  return (
    <div ref={ref} className={className} style={{ ...maskStyle, ...style }}>
      {children}
    </div>
  );
}
