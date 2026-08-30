"use client";

import { useState } from "react";
import { useHaptics } from "@/lib/haptics";
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
  const haptic = useHaptics();

  return (
    <>
      <div className="mode-switch" role="group" aria-label="View">
        {(["scroll", "sphere"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              if (m !== mode) haptic(30);
              setMode(m);
            }}
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
        <ImageSphereView shots={shots} title={title} />
      )}
    </>
  );
}
