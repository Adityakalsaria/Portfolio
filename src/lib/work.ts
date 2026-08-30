export type Project = {
  slug: string;
  title: string;
  /** What it was, in the client's own terms — not a category restatement. */
  blurb: string;
  year: string;
  /** Replace with exports from the Figma file. */
  cover: string;
};

export type Category = {
  id: string;
  name: string;
  /** Reads as a caption under the name; says what this body of work is for. */
  note: string;
  projects: Project[];
};

/**
 * Mirrors the four pages of the Figma source file. Projects are placeholders
 * until the real exports land in /public/work.
 */
export const CATEGORIES: Category[] = [
  {
    id: "landing",
    name: "Landing Pages",
    note: "Sites that have to explain a product and sell it in one scroll.",
    projects: [
      { slug: "landing-01", title: "Untitled", blurb: "Marketing site", year: "2025", cover: "/work/placeholder.svg" },
      { slug: "landing-02", title: "Untitled", blurb: "Marketing site", year: "2024", cover: "/work/placeholder.svg" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Assets",
    note: "Campaign systems, launch graphics and social sets built to scale.",
    projects: [
      { slug: "marketing-01", title: "Untitled", blurb: "Campaign system", year: "2025", cover: "/work/placeholder.svg" },
    ],
  },
  {
    id: "product",
    name: "Product",
    note: "End-to-end product work: flows, states and the decisions behind them.",
    projects: [
      { slug: "product-01", title: "Untitled", blurb: "Product design", year: "2025", cover: "/work/placeholder.svg" },
    ],
  },
  {
    id: "ui",
    name: "UI",
    note: "Interface craft — components, density, and the details up close.",
    projects: [
      { slug: "ui-01", title: "Untitled", blurb: "Interface", year: "2024", cover: "/work/placeholder.svg" },
    ],
  },
];
