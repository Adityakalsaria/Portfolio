import type { SphereShot } from "./work";

export type Box = { x: number; y: number; width: number; height: number };
/** A run of consecutive shots that belong to one campaign. */
export type Group = { title: string; start: number; count: number };
/** Where a group's label sits, and how far its run extends. */
export type Label = { title: string; x: number; y: number; width: number };
export type Layout = {
  boxes: Box[];
  labels: Label[];
  width: number;
  height: number;
};

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
  grow: number[] = [],
  groups: Group[] = []
): Layout {
  const boxes: Box[] = [];
  const labels: Label[] = [];
  /** A campaign break is a wider gap, so the eye reads a boundary without
   *  needing a rule drawn between them. */
  const BREAK = gap * 4;
  /** Room for the campaign name at the top of the band. Reserved rather than
   *  set as a negative margin — the gallery clips its overflow, so a label
   *  placed above y=0 was simply invisible. */
  const HEAD = groups.length ? 24 : 0;
  const band = box.h - HEAD;
  let x = 0;
  let g = 0;
  let runStart = 0;

  shots.forEach((s, i) => {
    if (groups[g] && groups[g].start === i) {
      if (i > 0) x += BREAK - gap;
      runStart = x;
    }
    const aspect = s.width / s.height;
    const scale = 1 + 0.09 * (grow[i] ?? 0);
    const width = Math.min(box.w, band * aspect) * scale;
    const height = width / aspect;
    boxes.push({ x, y: HEAD + (band - height) / 2, width, height });
    x += width + gap;

    const cur = groups[g];
    if (cur && i === cur.start + cur.count - 1) {
      labels.push({ title: cur.title, x: runStart, y: 0, width: x - gap - runStart });
      g += 1;
    }
  });
  return { boxes, labels, width: Math.max(0, x - gap), height: box.h };
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
  inner = width,
  groups: Group[] = []
): Layout {
  const gridW = Math.min(width, inner);
  const left = (width - gridW) / 2;
  const colW = (gridW - gap * (columns - 1)) / columns;
  const boxes: Box[] = [];
  const labels: Label[] = [];
  /** Room for a campaign heading above each band. */
  const HEAD = groups.length ? 44 : 0;

  // Each group packs its own columns and then the next band starts below the
  // tallest of them, so a campaign never interleaves with the one after it.
  const runs = groups.length
    ? groups
    : [{ title: "", start: 0, count: shots.length }];
  let top = 0;
  for (const run of runs) {
    if (run.title) labels.push({ title: run.title, x: left, y: top, width: gridW });
    const bandTop = top + HEAD;
    const heights = new Array(columns).fill(bandTop);
    for (let i = run.start; i < run.start + run.count; i++) {
      const s = shots[i];
      if (!s) continue;
      let col = 0;
      for (let c = 1; c < columns; c++) if (heights[c] < heights[col]) col = c;
      const h = colW / (s.width / s.height);
      boxes[i] = { x: left + col * (colW + gap), y: heights[col], width: colW, height: h };
      heights[col] += h + gap;
    }
    top = Math.max(...heights) - gap + gap * 3;
  }
  return { boxes, labels, width, height: Math.max(0, top - gap * 3) };
}
