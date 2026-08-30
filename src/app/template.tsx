"use client";

import { useEffect, useState } from "react";

/**
 * template.tsx remounts on every navigation, so a curtain that only plays
 * *out* is enough — no exit animation and nothing to coordinate.
 *
 * The wipe is a CSS animation, not a JS tween, and the element is unmounted on
 * a timer regardless of whether that animation ever ran. A curtain that
 * depends on requestAnimationFrame to get out of the way will cover the whole
 * page in any context where rAF is throttled or JS stalls.
 */
const WIPE_MS = 850;

export default function Template({ children }: { children: React.ReactNode }) {
  const [covered, setCovered] = useState(true);

  useEffect(() => {
    // A hash in the URL is an explicit destination — don't overrule it.
    if (!window.location.hash) window.scrollTo(0, 0);

    const t = setTimeout(() => setCovered(false), WIPE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {covered && <div aria-hidden className="page-wipe" />}
      {children}
    </>
  );
}
