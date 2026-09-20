"use client";

import { useState, useSyncExternalStore } from "react";
import Wall from "./Wall";
import Gallery from "./Gallery";
import type { Shot, SphereShot } from "@/lib/work";
import type { Group } from "@/lib/layout";

type Mode = "wall" | "grid";

/** Phone width, matching the wall's own small-screen breakpoint. */
const PHONE = "(max-width: 40rem)";

/** Whether the screen is phone width. null on the server and until the client
 *  has hydrated, when it is not yet known. */
function usePhone(): boolean | null {
  return useSyncExternalStore(
    (notify) => {
      const q = window.matchMedia(PHONE);
      q.addEventListener("change", notify);
      return () => q.removeEventListener("change", notify);
    },
    () => window.matchMedia(PHONE).matches,
    () => null
  );
}

/**
 * Three ways through a project's images.
 *
 * Carousel and Grid are the same component in two layouts, so switching
 * between them moves the items rather than replacing them. The Wall is its
 * own thing: fixed cells that each hold a piece for a few seconds before the
 * next takes its place, so the whole set is seen without scrolling.
 */
export default function Showcase({
  shots,
  allShots,
  gridShots,
  title,
  groups,
  gridOnly,
}: {
  shots: Shot[];
  /** Everything, where a view shows more than the scroll's own images. */
  allShots?: SphereShot[];
  /** What the grid shows. The posts, where a project has them. */
  gridShots?: SphereShot[];
  /** Campaign runs over the same list. */
  groups?: Group[];
  title: string;
  /** No wall and no view switch: the grid alone, for work read as screens. */
  gridOnly?: boolean;
}) {
  const [picked, setMode] = useState<Mode>("wall");
  const phone = usePhone();
  // The grid alone where the wall has no place: on a phone, and for work read
  // as screens. Neither has a view switch.
  const gridAlone = gridOnly || phone === true;
  const mode: Mode = gridAlone ? "grid" : picked;
  // Until the screen size is known, draw neither view: the wall would flash
  // on a phone before giving way to the grid.
  const pending = !gridOnly && phone === null;

  // A plain Shot has no href or video, so name the resolved list as the wider
  // type rather than letting the fallback narrow it.
  const base: SphereShot[] = gridShots?.length ? gridShots : (allShots ?? shots);
  // Tag each with its campaign, so an opened frame can name itself the way a
  // Figma frame does.
  const tiles: SphereShot[] = groups?.length
    ? base.map((s, i) => {
        const g = groups.find((x) => i >= x.start && i < x.start + x.count);
        return g ? { ...s, name: g.title } : s;
      })
    : base;

  return (
    <>
      {!gridAlone && !pending && (
        <div className="mode-switch" role="group" aria-label="View">
          {(["wall", "grid"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={mode === m ? "mode-btn is-on" : "mode-btn"}
              title={m === "wall" ? "Wall" : "Grid"}
            >
              {m === "wall" ? "Wall" : "Grid"}
            </button>
          ))}
        </div>
      )}

      {pending ? null : mode === "wall" ? (
        <Wall shots={tiles} title={title} />
      ) : (
        // One component for both: switching between them is a retarget, not
        // an unmount, so the items travel rather than blink.
        <Gallery shots={tiles} groups={groups} mode="grid" title={title} />
      )}
    </>
  );
}
