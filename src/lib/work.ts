import { GENERATED } from "./work.generated";
import { MANUAL } from "./manual";

export type Shot = { src: string; width: number; height: number };

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
  { id: "marketing-assets", name: "Marketing Assets", aliases: ["marketing-assets", "marketing-aseets", "marketing"] },
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

export function findProject(slug: string) {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}
