import type { Category } from "./work";

/**
 * Hand-added work that does not come from the Figma import. These are merged
 * ahead of the generated projects for the same category, so re-running the
 * importer never drops them.
 */
const KOSH_SHOTS = [
  { src: "/work/marketing-assets/kosh/kosh-01.webp", width: 1600, height: 1972 },
  { src: "/work/marketing-assets/kosh/kosh-02.webp", width: 1600, height: 1972 },
  { src: "/work/marketing-assets/kosh/kosh-03.webp", width: 1600, height: 1972 },
  { src: "/work/marketing-assets/kosh/kosh-04.webp", width: 1600, height: 1972 },
  { src: "/work/marketing-assets/kosh/kosh-05.webp", width: 1600, height: 900 },
  { src: "/work/marketing-assets/kosh/kosh-06.webp", width: 1600, height: 1200 },
  { src: "/work/marketing-assets/kosh/kosh-07.webp", width: 1600, height: 1600 },
  { src: "/work/marketing-assets/kosh/kosh-08.webp", width: 1600, height: 1600 },
  { src: "/work/marketing-assets/kosh/kosh-09.webp", width: 1600, height: 1600 },
  { src: "/work/marketing-assets/kosh/kosh-10.webp", width: 1600, height: 1600 },
  { src: "/work/marketing-assets/kosh/kosh-11.webp", width: 1600, height: 1600 },
  { src: "/work/marketing-assets/kosh/kosh-12.webp", width: 1600, height: 900 },
  { src: "/work/marketing-assets/kosh/kosh-13.webp", width: 1600, height: 958 },
  { src: "/work/marketing-assets/kosh/kosh-14.webp", width: 1600, height: 900 },
  { src: "/work/marketing-assets/kosh/kosh-15.webp", width: 1600, height: 958 },
  { src: "/work/marketing-assets/kosh/kosh-16.webp", width: 1600, height: 840 },
  { src: "/work/marketing-assets/kosh/kosh-17.webp", width: 1600, height: 900 },
  { src: "/work/marketing-assets/kosh/kosh-18.webp", width: 1600, height: 1972 },
  { src: "/work/marketing-assets/kosh/kosh-19.webp", width: 1600, height: 997 },
  { src: "/work/marketing-assets/kosh/kosh-20.webp", width: 1600, height: 1600 },
  { src: "/work/marketing-assets/kosh/kosh-21.webp", width: 1600, height: 900 },
];

export const MANUAL: Category[] = [
  {
    id: "marketing-assets",
    name: "Marketing Assets",
    projects: [
      {
        slug: "kosh-work",
        title: "KOSH work",
        intro:
          "Marketing and social assets for KOSH — launch announcements, card reveals and campaign graphics.",
        cover: KOSH_SHOTS[0].src,
        width: KOSH_SHOTS[0].width,
        height: KOSH_SHOTS[0].height,
        shots: KOSH_SHOTS,
      },
    ],
  },
];
