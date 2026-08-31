"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SphereShot } from "@/lib/work";

/**
 * One item in the scroll column.
 *
 * A clip only loads once it is near the viewport and only plays while it is
 * on screen — eighteen videos fetching at once would cost more than the whole
 * rest of the page. It plays muted here because nothing has been clicked yet;
 * opening it is what gets you sound.
 */
export default function ScrollShot({
  shot,
  alt,
  onOpen,
}: {
  shot: SphereShot;
  alt: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shot.clip) return;

    // Two thresholds off one observer: a wide margin decides when to fetch,
    // and actual intersection decides when to play.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        const v = video.current;
        if (!v) return;
        if (entry.intersectionRatio > 0.25) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "400px 0px", threshold: [0, 0.25, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shot.clip]);

  return (
    <figure
      ref={ref}
      className="shot relative w-full overflow-hidden bg-surface"
      style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
    >
      <button type="button" onClick={onOpen} aria-label={shot.clip ? "Play with sound" : "Open image"}>
        {shot.clip ? (
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            poster={shot.src}
            src={near ? shot.clip : undefined}
            preload="none"
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={shot.src}
            alt={alt}
            fill
            sizes="(max-width: 60rem) 100vw, 36rem"
            className="object-cover"
          />
        )}
      </button>
    </figure>
  );
}
