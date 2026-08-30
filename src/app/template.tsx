"use client";

import { useEffect } from "react";

/** Remounts on navigation; only job is to reset scroll without fighting a hash. */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return <>{children}</>;
}
