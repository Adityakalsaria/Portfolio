import type { SphereShot } from "./work";

export type Box = { x: number; y: number; width: number; height: number };
export type Layout = { boxes: Box[]; width: number; height: number };

/**
 * The horizontal strip: every item fitted inside one box, laid end to end and
 * vertically centred. Widths differ because proportions differ, which is what
 * gives the strip its rhythm.
 */
export function stripLayout(
  shots: SphereShot[],
  box: { w: number; h: number },
  gap: number,
  /** Per-item growth, 0–1, from the hover springs. A grown item takes more
   *  room, so its neighbours are pushed apart rather than overlapped — the
   *  push comes out of the layout, not a separate effect. */
  grow: number[] = []
): Layout {
  const boxes: Box[] = [];
  let x = 0;
  shots.forEach((s, i) => {
    const aspect = s.width / s.height;
    const scale = 1 + 0.09 * (grow[i] ?? 0);
    const width = Math.min(box.w, box.h * aspect) * scale;
    const height = width / aspect;
    boxes.push({ x, y: (box.h - height) / 2, width, height });
    x += width + gap;
  });
  return { boxes, width: Math.max(0, x - gap), height: box.h };
}

/**
 * The packed grid: fixed-width columns, each item dropped into the shortest
 * one. Heights follow the images rather than being cropped to a square, so
 * the columns end ragged — which is the point of packing them this way.
 */
export function gridLayout(
  shots: SphereShot[],
  width: number,
  columns: number,
  gap: number,
  /** Centres a narrower grid inside a wider host, so the columns stay a
   *  readable size on a large screen instead of sprawling. */
  inner = width
): Layout {
  const gridW = Math.min(width, inner);
  const left = (width - gridW) / 2;
  const colW = (gridW - gap * (columns - 1)) / columns;
  const heights = new Array(columns).fill(0);
  const boxes: Box[] = [];
  for (const s of shots) {
    let col = 0;
    for (let i = 1; i < columns; i++) if (heights[i] < heights[col]) col = i;
    const h = colW / (s.width / s.height);
    boxes.push({ x: left + col * (colW + gap), y: heights[col], width: colW, height: h });
    heights[col] += h + gap;
  }
  return { boxes, width, height: Math.max(0, Math.max(...heights) - gap) };
}
