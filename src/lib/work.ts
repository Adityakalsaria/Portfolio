import type { Post } from "./posts";
import { GENERATED } from "./work.generated";
import { MANUAL } from "./manual";

export type Shot = { src: string; width: number; height: number };

/** A shot in the wall or grid, which may open its source and may be the
 *  poster frame of a video rather than a still. */
/**
 * Taller than this and it is a page, not a graphic.
 *
 * A landing page is many times taller than it is wide. Fitted whole it comes
 * out a 100px sliver in the wall and 227px across when opened — a 4288px
 * design at 227px. So a page is cropped to its hero in a tile and scrolled
 * when opened, rather than shrunk until it fits.
 */
export const PAGE_RATIO = 1.7;
/** The proportions a page is shown at in a tile, cropped from its top. */
export const PAGE_TILE_ASPECT = 0.78;

export const isPage = (s: { width: number; height: number }) =>
  s.height / s.width > PAGE_RATIO;

export type SphereShot = Shot & {
  /** The campaign this belongs to, shown as the frame's name when opened. */
  name?: string;
  /**
   * A tall page, cut into stackable segments.
   *
   * WebP cannot exceed 16383px in either direction, and a 16400px page
   * captured at 2x is 32796 tall. One file would have to come down to about
   * 1438px wide to fit — softer than a retina viewer wants — so it is stored
   * at full width in pieces and stacked back together seamlessly.
   */
  parts?: Shot[];
  href?: string;
  video?: boolean;
  /** Local MP4, played on the plane once it is focused. */
  clip?: string;
};

export type Section = { title: string; shots: Shot[] };

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
  { id: "landing-pages", name: "Landing Pages", aliases: ["landing-page", "landing-pages"] },
  { id: "marketing-assets", name: "Visual design", aliases: ["marketing-assets", "marketing-aseets", "marketing"] },
  { id: "product", name: "Product", aliases: ["product"] },
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

export const HAS_WORK = ALL_PROJECTS.length > 0;

/** The project a category opens on — the most recent, which leads the list. */
export function leadProject(c: Category): Project | undefined {
  return c.projects[0];
}

/** Every image in a category, so hovering its row can run the whole body. */
export function categoryShots(c: Category): Shot[] {
  return c.projects.flatMap(
    (p) => p.shots ?? [{ src: p.cover, width: p.width ?? 4, height: p.height ?? 3 }]
  );
}

/** The other projects in a project's category, for the rail. */
export function siblingsOf(slug: string) {
  const cat = CATEGORIES.find((c) => c.projects.some((p) => p.slug === slug));
  return cat ? cat.projects : [];
}

export function findProject(slug: string) {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}
