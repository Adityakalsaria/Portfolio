"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GhostReveal } from "./GhostReveal";
import Reveal from "./Reveal";
import type { Shot } from "@/lib/work";

const MASK_V = "/masks/feather-v.svg";
const MASK_H = "/masks/feather-h.svg";

type Mode = "scroll" | "reveal";

/**
 * Two ways through a project's images: the stacked scroll, and one at a time
 * bleeding in through a feathered mask.
 *
 * In reveal mode the image only swaps once the mask has finished animating
 * out, so a new image can never appear over the outgoing one mid-transition.
 */
export default function Showcase({
  shots,
  title,
}: {
  shots: Shot[];
  title: string;
}) {
  const [mode, setMode] = useState<Mode>("scroll");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const pending = useRef<number | null>(null);

  /** Replays the reveal on entering the mode, so switching back and forth
   *  animates rather than snapping to a static image. */
  const selectMode = (m: Mode) => {
    setMode(m);
    if (m !== "reveal") return;
    setOpen(false);
    setTimeout(() => setOpen(true), 60);
  };

  const go = useCallback(
    (delta: number) => {
      if (pending.current !== null) return; // mid-transition
      const next = (index + delta + shots.length) % shots.length;
      pending.current = next;
      setOpen(false);
    },
    [index, shots.length]
  );

  const onHidden = useCallback(() => {
    if (pending.current === null) return;
    setIndex(pending.current);
    pending.current = null;
    requestAnimationFrame(() => setOpen(true));
  }, []);

  useEffect(() => {
    if (mode !== "reveal") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, go]);

  const shot = shots[index];

  return (
    <>
      <div className="mode-switch" role="group" aria-label="View">
        {(["scroll", "reveal"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => selectMode(m)}
            aria-pressed={mode === m}
            className={mode === m ? "mode-btn is-on" : "mode-btn"}
          >
            {m === "scroll" ? "Scroll" : "Reveal"}
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
        <div className="mt-6">
          <GhostReveal
            play={open}
            onHidden={onHidden}
            maskSrc={MASK_V}
            maskSrcH={MASK_H}
            direction="up"
            scale={500}
            duration={1100}
          >
            <div
              className="relative w-full overflow-hidden bg-surface"
              style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
            >
              <Image
                src={shot.src}
                alt={`${title}, ${index + 1} of ${shots.length}`}
                fill
                sizes="(max-width: 60rem) 100vw, 36rem"
                className="object-cover"
                priority
              />
            </div>
          </GhostReveal>

          <div className="mt-4 flex items-center justify-between">
            <button type="button" className="link" onClick={() => go(-1)}>
              Previous
            </button>
            <span className="sub tabular-nums">
              {index + 1} / {shots.length}
            </span>
            <button type="button" className="link" onClick={() => go(1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
