"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import ImageSphereView from "./ImageSphereView";
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
          {tiles.map((s) => {
            const tile = (
              <>
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(max-width: 34rem) 45vw, 190px"
                  className="object-cover"
                />
                {s.video && <span className="post-play" aria-hidden />}
              </>
            );
            return (
              <li key={s.src} className="grid-cell">
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label="Open post on X">
                    {tile}
                  </a>
                ) : (
                  tile
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <ImageSphereView shots={sphereShots ?? shots} title={title} />
      )}
    </>
  );
}
