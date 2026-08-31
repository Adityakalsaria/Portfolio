"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import ImageSphereView from "./ImageSphereView";
import Lightbox from "./Lightbox";
import type { Shot, SphereShot } from "@/lib/work";

type Mode = "scroll" | "grid" | "sphere";

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
  gridShots,
  title,
}: {
  shots: Shot[];
  /** What the sphere shows, when it is more than the scroll's own images. */
  sphereShots?: SphereShot[];
  /** What the grid shows. The posts, where a project has them. */
  gridShots?: SphereShot[];
  title: string;
}) {
  const [mode, setMode] = useState<Mode>("scroll");
  const [open, setOpen] = useState<SphereShot | null>(null);

  // A plain Shot has no href or video, so name the resolved list as the wider
  // type rather than letting the fallback narrow it.
  const tiles: SphereShot[] = gridShots?.length
    ? gridShots
    : (sphereShots ?? shots);

  return (
    <>
      <div className="mode-switch" role="group" aria-label="View">
        {(["scroll", "grid", "sphere"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={mode === m ? "mode-btn is-on" : "mode-btn"}
          >
            {m === "scroll" ? "Scroll" : m === "grid" ? "Grid" : "Sphere"}
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
      ) : mode === "grid" ? (
        <ul className="grid-view">
          {tiles.map((s) => (
            <li key={s.src} className="grid-cell">
              {/* A button, not a link: clicking opens it here, the way the
                  sphere does. The link to the post lives inside. */}
              <button
                type="button"
                onClick={() => setOpen(s)}
                aria-label={s.href ? "Open post" : "Open image"}
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  // Doubled deliberately: a tile renders ~190px, and a 1x
                  // candidate at that width is visibly soft on a 2x screen.
                  sizes="(max-width: 34rem) 90vw, 400px"
                  className="object-cover"
                />
                {s.video && <span className="post-play" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ImageSphereView shots={sphereShots ?? shots} title={title} />
      )}
      {open && <Lightbox shot={open} onClose={() => setOpen(null)} />}
    </>
  );
}
