"use client";

import { useState } from "react";
import ImageSphereView from "./ImageSphereView";
import Gallery from "./Gallery";
import type { Shot, SphereShot } from "@/lib/work";

type Mode = "scroll" | "grid" | "sphere";

/**
 * Three ways through a project's images.
 *
 * Carousel and Grid are the same component in two layouts, so switching
 * between them moves the items rather than replacing them. The sphere is its
 * own thing — a three.js cloud — and breaks out to the full viewport width,
 * since at the 36rem column the planes crowd each other.
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
            {m === "scroll" ? "Carousel" : m === "grid" ? "Grid" : "Sphere"}
          </button>
        ))}
      </div>

      {mode === "sphere" ? (
        <ImageSphereView shots={sphereShots ?? shots} title={title} />
      ) : (
        // One component for both: switching between them is a retarget, not
        // an unmount, so the items travel rather than blink.
        <Gallery shots={tiles} mode={mode === "scroll" ? "strip" : "grid"} title={title} />
      )}
    </>
  );
}
