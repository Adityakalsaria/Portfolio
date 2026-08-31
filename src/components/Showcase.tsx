"use client";

import { useState } from "react";
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
 *
 * It can also carry more than the scroll does — the published posts join the
 * cloud, where there is room for them, without lengthening the scroll.
 */
export default function Showcase({
  shots,
  sphereShots,
  title,
}: {
  shots: Shot[];
  /** What the sphere shows, when it is more than the scroll's own images. */
  sphereShots?: Shot[];
  title: string;
}) {
  const [mode, setMode] = useState<Mode>("scroll");

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
                className="shot relative w-full overflow-hidden bg-surface"
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
        <ImageSphereView shots={sphereShots ?? shots} title={title} />
      )}
    </>
  );
}
