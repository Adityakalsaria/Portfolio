"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import ImageSphereView from "./ImageSphereView";
import type { Shot } from "@/lib/work";

type Mode = "scroll" | "sphere";

/**
 * Two ways through a project's images: the stacked scroll, and a cloud of them
 * orbiting an invisible sphere.
 *
 * The sphere breaks out to the full viewport width in place. At the 36rem
 * column the planes crowd each other and most of the set sits off to the
 * sides; it stays on the page rather than opening as a separate view.
 */
export default function Showcase({
  shots,
  title,
}: {
  shots: Shot[];
  title: string;
}) {
  const [mode, setMode] = useState<Mode>("scroll");
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "sphere") return;
    // Align the canvas with the top of the window first, then freeze the page.
    // Locked, the canvas fills the viewport exactly, so a focused plane lands
    // on the window centre without any further scrolling.
    stage.current?.scrollIntoView({ block: "start" });

    // Two locks, because they cover different cases. overflow:hidden stops a
    // native wheel; stopping Lenis stops the smooth-scroll layer, which sets
    // scroll position programmatically and ignores overflow entirely. Under
    // reduced motion Lenis never runs and the overflow lock is the only one.
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    const prevBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("scroll-lock", { detail: true }));

    return () => {
      root.style.overflow = prevRoot;
      document.body.style.overflow = prevBody;
      window.dispatchEvent(new CustomEvent("scroll-lock", { detail: false }));
    };
  }, [mode]);

  return (
    <>
      <div className="mode-switch" role="group" aria-label="View">
        {(["scroll", "sphere"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={mode === m ? "mode-btn is-on" : "mode-btn"}
          >
            {m === "scroll" ? "Scroll" : "Sphere"}
          </button>
        ))}
      </div>

      {mode === "scroll" ? (
        <div className="mt-6 flex flex-col gap-3">
          {shots.map((s, i) => (
            <Reveal key={s.src} y={28}>
              <figure
                className="relative w-full overflow-hidden bg-surface"
                style={{ aspectRatio: `${s.width} / ${s.height}` }}
              >
                <Image
                  src={s.src}
                  alt={`${title}, ${i + 1} of ${shots.length}`}
                  fill
                  sizes="(max-width: 60rem) 100vw, 36rem"
                  className="object-cover"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      ) : (
        <div ref={stage}>
          <ImageSphereView shots={shots} title={title} />
        </div>
      )}
    </>
  );
}
