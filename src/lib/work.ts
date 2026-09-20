import type { Post } from "./posts";
import { GENERATED } from "./work.generated";
import { MANUAL } from "./manual";

export type Shot = {
  src: string;
  width: number;
  height: number;
  /** Set when src is the poster frame of a video rather than a still. */
  video?: boolean;
  /** Local MP4, played in place once the shot is focused. */
  clip?: string;
};

/** A shot in the wall or grid, which may open its source. */
export type SphereShot = Shot & {
  /** The campaign this belongs to, shown as the frame's name when opened. */
  name?: string;
  href?: string;
};

/**
 * Derived files written by scripts/optimize.mjs. Keep the sizes in step with it.
 * Originals are never replaced: an opened image or clip still loads the
 * untouched file, and these are what tiles load instead.
 */
export const thumb = (src: string, w: 480 | 960 | 1600) =>
  src.replace(/\.webp$/, `.w${w}.webp`);
/** Tile-sized srcset, for 1x and 2x screens. */
export const tileSrcSet = (src: string) => `${thumb(src, 480)} 480w, ${thumb(src, 960)} 960w`;
/** A short silent loop of a clip, for playing in a tile. */
export const tileClip = (clip: string) => clip.replace(/\.mp4$/, ".tile.mp4");
/** Whether a 1600px display size exists: only for originals well past it. */
export const hasMedium = (s: { width: number }) => s.width > 2000;

export type Section = {
  title: string;
  shots: Shot[];
  /** Grid view: show the whole section on a single row. */
  row?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  /** One line under the title on the project page. */
  intro?: string;
  /** Named groups; when absent the shots render as one flat run. */
  sections?: Section[];
  /** Cover dimensions, used to reserve aspect ratio before load. */
  width?: number;
  height?: number;
  cover: string;
  /** Present when the project is a set rather than a single image. */
  shots?: Shot[];
  /** Link previews for where this work was published. */
  posts?: Post[];
};

export type Category = {
  id: string;
  name: string;
  projects: Project[];
};

/**
 * The four categories are fixed here rather than taken from Figma, so a
 * renamed or misspelled page in the file cannot rename a section of the site.
 * Aliases map the Figma page slugs onto them.
 */
const CANONICAL: { id: string; name: string; aliases: string[] }[] = [
  { id: "marketing-assets", name: "Visual design", aliases: ["marketing-assets", "marketing-aseets", "marketing"] },
  { id: "ui", name: "UI", aliases: ["ui"] },
];

const matched = new Set<string>();

function generatedFor(aliases: string[]): Project[] {
  return GENERATED.filter((g) => {
    const hit = aliases.includes(g.id);
    if (hit) matched.add(g.id);
    return hit;
  }).flatMap((g) => g.projects);
}

const manualFor = (id: string) =>
  MANUAL.filter((m) => m.id === id).flatMap((m) => m.projects);

export const CATEGORIES: Category[] = [
  ...CANONICAL.map((c) => ({
    id: c.id,
    name: c.name,
    projects: [...manualFor(c.id), ...generatedFor(c.aliases)],
  })),
  // A Figma page that matches nothing still shows up rather than vanishing.
  ...GENERATED.filter((g) => !matched.has(g.id)),
];

export const ALL_PROJECTS = CATEGORIES.flatMap((c) =>
  c.projects.map((p) => ({ ...p, category: c }))
);

/** The project a category opens on — the most recent, which leads the list. */
export function leadProject(c: Category): Project | undefined {
  return c.projects[0];
}

/** The other projects in a project's category, for the rail. */
export function siblingsOf(slug: string) {
  const cat = CATEGORIES.find((c) => c.projects.some((p) => p.slug === slug));
  return cat ? cat.projects : [];
}

export function findProject(slug: string) {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}
