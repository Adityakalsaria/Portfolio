import type { Category } from "./work";
import { POSTS } from "./posts.generated";

/**
 * Hand-added work that does not come from the Figma import. These are merged
 * ahead of the generated projects for the same category, so re-running the
 * importer never drops them.
 */
const KOSH_SHOTS = [
  { src: "/work/marketing-assets/kosh/kosh-01.webp", width: 2048, height: 2524 },
  { src: "/work/marketing-assets/kosh/kosh-02.webp", width: 2048, height: 2524 },
  { src: "/work/marketing-assets/kosh/kosh-03.webp", width: 2048, height: 2524 },
  { src: "/work/marketing-assets/kosh/kosh-04.webp", width: 2048, height: 2524 },
  { src: "/work/marketing-assets/kosh/kosh-05.webp", width: 2048, height: 4453 },
  { src: "/work/marketing-assets/kosh/kosh-06.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-07.webp", width: 2048, height: 1536 },
  { src: "/work/marketing-assets/kosh/kosh-08.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-09.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-10.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-11.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-12.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-13.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-14.webp", width: 2048, height: 1226 },
  { src: "/work/marketing-assets/kosh/kosh-15.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-16.webp", width: 2048, height: 1226 },
  { src: "/work/marketing-assets/kosh/kosh-17.webp", width: 2048, height: 1076 },
  { src: "/work/marketing-assets/kosh/kosh-18.webp", width: 2048, height: 1152 },
  { src: "/work/marketing-assets/kosh/kosh-19.webp", width: 2048, height: 2524 },
  { src: "/work/marketing-assets/kosh/kosh-20.webp", width: 2048, height: 1276 },
  { src: "/work/marketing-assets/kosh/kosh-21.webp", width: 2048, height: 2048 },
  { src: "/work/marketing-assets/kosh/kosh-22.webp", width: 2048, height: 1152 },
];

/** Stand-in work, so a category with siblings can be seen behaving. Delete
 *  this and its images under public/work/marketing-assets/sample when there
 *  is real work to put in its place. */
const SAMPLE_SHOTS = [
    { src: "/work/marketing-assets/sample/sample-01.webp", width: 1602, height: 1002 },
    { src: "/work/marketing-assets/sample/sample-02.webp", width: 1602, height: 1602 },
    { src: "/work/marketing-assets/sample/sample-03.webp", width: 1202, height: 1602 },
    { src: "/work/marketing-assets/sample/sample-04.webp", width: 1602, height: 902 },
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
        posts: POSTS,
      },
      {
        slug: "sample-project",
        title: "Placeholder project",
        intro:
          "Stand-in work, here so the category's project list has something to show. Replace when there is real work for it.",
        cover: SAMPLE_SHOTS[0].src,
        width: SAMPLE_SHOTS[0].width,
        height: SAMPLE_SHOTS[0].height,
        shots: SAMPLE_SHOTS,
      },
    ],
  },
];
