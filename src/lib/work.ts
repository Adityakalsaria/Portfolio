import { GENERATED } from "./work.generated";

export type Project = {
  slug: string;
  title: string;
  /** Frame dimensions from Figma, used to reserve aspect ratio before load. */
  width?: number;
  height?: number;
  cover: string;
};

export type Category = {
  id: string;
  name: string;
  projects: Project[];
};

/** Category is a Figma page; the note is editorial and lives here, not there. */
const NOTES: Record<string, string> = {
  "landing-page": "Sites that have to explain a product and sell it in one scroll.",
  "landing-pages": "Sites that have to explain a product and sell it in one scroll.",
  "marketing-assets": "Campaign systems, launch graphics and social sets built to scale.",
  "marketing-aseets": "Campaign systems, launch graphics and social sets built to scale.",
  product: "End-to-end product work: flows, states and the decisions behind them.",
  ui: "Interface craft — components, density, and the details up close.",
};

export type ResolvedCategory = Category & { note: string };

/** Shown until `node scripts/figma-import.mjs` has run. */
const PLACEHOLDER: Category[] = [
  { id: "landing-pages", name: "Landing Pages", projects: [] },
  { id: "marketing-assets", name: "Marketing Assets", projects: [] },
  { id: "product", name: "Product", projects: [] },
  { id: "ui", name: "UI", projects: [] },
];

const source = GENERATED.length ? GENERATED : PLACEHOLDER;

export const CATEGORIES: ResolvedCategory[] = source.map((c) => ({
  ...c,
  note: NOTES[c.id] ?? "",
}));

export const ALL_PROJECTS = CATEGORIES.flatMap((c) =>
  c.projects.map((p) => ({ ...p, category: c }))
);

export const HAS_WORK = ALL_PROJECTS.length > 0;

export function findProject(slug: string) {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}
